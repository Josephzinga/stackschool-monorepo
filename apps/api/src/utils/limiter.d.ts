import { RateLimiterRes } from 'rate-limiter-flexible';
import type { Request } from 'express';
export declare const consumeResendCode: (req: Request) => Promise<RateLimiterRes>;
export declare const consumeCode: (req: Request) => Promise<RateLimiterRes>;
export declare const resetVerifyCodeLimit: (req: Request) => Promise<boolean>;
export declare const consumeIp: (req: Request) => Promise<RateLimiterRes>;
export declare const consumeIdentifier: (req: Request) => Promise<RateLimiterRes>;
//# sourceMappingURL=limiter.d.ts.map