"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeIdentifier = exports.consumeIp = exports.resetVerifyCodeLimit = exports.consumeCode = exports.consumeResendCode = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const resendCodeLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 5,
    duration: 900,
});
const consumeResendCode = (req) => {
    const ip = req.ip;
    if (!ip)
        return Promise.reject(new Error('IP manquants dans resend_code'));
    return resendCodeLimiter.consume(ip);
};
exports.consumeResendCode = consumeResendCode;
const verifyCodeLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 4,
    duration: 600,
});
const consumeCode = (req) => {
    const ip = req.ip;
    if (!ip)
        return Promise.reject(new Error('IP manquants'));
    return verifyCodeLimiter.consume(ip);
};
exports.consumeCode = consumeCode;
const resetVerifyCodeLimit = (req) => {
    const ip = req.ip;
    if (!ip)
        return Promise.resolve(false);
    return verifyCodeLimiter.delete(ip);
};
exports.resetVerifyCodeLimit = resetVerifyCodeLimit;
const rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 3,
    duration: 900,
});
const consumeIp = (req) => {
    const ip = req.ip;
    if (!ip)
        return Promise.reject(new Error('Missing IP address'));
    return rateLimiter.consume(ip);
};
exports.consumeIp = consumeIp;
const identifierLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 8,
    duration: 600,
});
const consumeIdentifier = (req) => {
    const identifier = req.body?.identifier;
    if (!identifier)
        return Promise.reject(new Error('Missing identifier'));
    return identifierLimiter.consume(identifier);
};
exports.consumeIdentifier = consumeIdentifier;
//# sourceMappingURL=limiter.js.map