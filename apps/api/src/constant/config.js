"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_EXPIRES_DAY = exports.MAX_CODE_ATTEMPTS = exports.RESEND_COOLDOWN_SECONDS = exports.CODE_EXPIRES_MINUTES = exports.RESET_TOKEN_EXP_MINUTES = exports.TEMP_TOKEN_EXP = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.TEMP_TOKEN_EXP = '30m';
exports.RESET_TOKEN_EXP_MINUTES = 15;
exports.CODE_EXPIRES_MINUTES = 20;
exports.RESEND_COOLDOWN_SECONDS = 60;
exports.MAX_CODE_ATTEMPTS = 5;
exports.SESSION_EXPIRES_DAY = 25;
//# sourceMappingURL=config.js.map