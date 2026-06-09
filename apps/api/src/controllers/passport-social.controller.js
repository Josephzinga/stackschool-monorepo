"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleOauthStrategy;
const auth_user_service_1 = require("../services/auth-user.service");
async function handleOauthStrategy(accessToken, refreshToken, profile, done, provider) {
    try {
        const providerAccountId = profile?.id;
        const emailRaw = profile?.emails?.[0]?.value || null;
        const emailVerified = profile.emails?.[0].verified ?? false;
        const email = emailRaw ? emailRaw.toLocaleLowerCase() : '';
        const displayName = profile?.displayName ?? '';
        const avatar = profile?.photos?.[0]?.value || null;
        const parts = displayName.trim() ? displayName.trim().split(/\s+/) : [];
        const firstname = parts.shift() ?? '';
        const lastname = parts.join(' ') ?? '';
        const user = await (0, auth_user_service_1.upsertOauthUser)({
            provider,
            email,
            displayName,
            avatar,
            firstname,
            lastname,
            providerAccountId,
            emailVerified,
            accessToken,
            refreshToken,
        });
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}
//# sourceMappingURL=passport-social.controller.js.map