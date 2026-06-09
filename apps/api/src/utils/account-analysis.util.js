"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeUserAccounts = analyzeUserAccounts;
function analyzeUserAccounts(user) {
    const hasLocalPassword = typeof user.password === 'string' && user.password.length > 0;
    const socialProviders = user.Account
        ? user.Account
            .map((acc) => acc.provider)
            .filter((p) => p !== undefined && p !== 'local')
        : [];
    const isSocialOnly = !hasLocalPassword && socialProviders.length > 0;
    return {
        hasLocalPassword,
        socialProviders,
        isSocialOnly,
    };
}
//# sourceMappingURL=account-analysis.util.js.map