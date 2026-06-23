import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import type { NextFunction, Request, Response } from 'express';

export interface RateLimitConfig {
  points: number;
  duration: number;
  blockDuration?: number;
  keyPrefix?: string;
  keyGenerator?: (req: Request) => string;
}

const defaultKeyGenerator = (req: Request): string => {
  const ip =
    req.ip ||
    (req.headers['x-forwarded-for'] as string | undefined)
      ?.split(',')[0]
      ?.trim();

  if (!ip) {
    throw new Error('Missing IP address for rate limiting');
  }

  return ip;
};

export const createRateLimiter = ({
  points,
  duration,
  blockDuration = 0,
  keyPrefix = 'rate-limit',
  keyGenerator = defaultKeyGenerator,
}: RateLimitConfig) => {
  const limiter = new RateLimiterMemory({
    points,
    duration,
    blockDuration,
    keyPrefix,
  });

  const consume = async (req: Request): Promise<RateLimiterRes> => {
    const key = keyGenerator(req);
    if (!key) {
      return Promise.reject(new Error('Missing rate limit key'));
    }
    return limiter.consume(key);
  };

  const middleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await consume(req);
      next();
    } catch (error: any) {
      const retrySecs = error?.msBeforeNext
        ? Math.ceil(error.msBeforeNext / 1000)
        : 1;

      res.setHeader('Retry-After', String(retrySecs));
      res.status(429).json({
        message: 'Trop de requêtes',
        code: 'RATE_LIMIT_EXCEEDED',
        details: [
          `Réessayez dans ${retrySecs} seconde${retrySecs > 1 ? 's' : ''}.`,
        ],
      });
    }
  };

  return {
    limiter,
    consume,
    middleware,
  };
};

const resendCodeRateLimiter = createRateLimiter({
  points: 5,
  duration: 900,
  keyPrefix: 'resend_code',
});

export const consumeResendCode = resendCodeRateLimiter.consume;

const verifyCodeRateLimiter = createRateLimiter({
  points: 4,
  duration: 600,
  keyPrefix: 'verify_code',
});

export const consumeCode = verifyCodeRateLimiter.consume;

export const resetVerifyCodeLimit = async (req: Request): Promise<boolean> => {
  const key = defaultKeyGenerator(req);
  if (!key) return false;
  return verifyCodeRateLimiter.limiter.delete(key);
};

const defaultRateLimiter = createRateLimiter({
  points: 3,
  duration: 900,
  keyPrefix: 'generic_ip',
});

export const consumeIp = defaultRateLimiter.consume;

const identifierLimiter = createRateLimiter({
  points: 8,
  duration: 600,
  keyPrefix: 'identifier',
  keyGenerator: (req: Request) => req.body?.identifier,
});

export const consumeIdentifier = identifierLimiter.consume;
