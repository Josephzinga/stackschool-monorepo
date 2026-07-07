// src/rate-limiter/rate-limiter.service.ts
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterService {
  private readonly verifyCodeLimiter = new RateLimiterMemory({
    keyPrefix: 'verify-code',
    points: 5,
    duration: 300, // 5 min
  });

  private readonly resendCodeLimiter = new RateLimiterMemory({
    keyPrefix: 'resend-code',
    points: 3,
    duration: 300,
  });

  private getKey(req: Request): string {
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  /** Consomme une tentative de vérification de code. Throw si dépassé. */
  async consumeVerifyCode(req: Request): Promise<void> {
    await this.verifyCodeLimiter.consume(this.getKey(req), 1);
  }

  /** Réinitialise le compteur verify-code (appelé après un resend réussi). */
  async resetVerifyCodeLimit(req: Request): Promise<void> {
    try {
      await this.verifyCodeLimiter.delete(this.getKey(req));
    } catch {
      // Silencieux : key inexistante = rien à reset
    }
  }

  /** Consomme une tentative de renvoi de code. Throw si dépassé. */
  async consumeResendCode(req: Request): Promise<void> {
    await this.resendCodeLimiter.consume(this.getKey(req), 1);
  }
}
