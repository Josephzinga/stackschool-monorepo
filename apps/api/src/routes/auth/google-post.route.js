"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const auth_user_service_1 = require("../../services/auth-user.service");
const express_1 = require("express");
const errorHandler_1 = require("../../middlewares/errorHandler");
const api_errors_1 = require("../../utils/api-errors");
const mobile_session_1 = require("../../lib/mobile-session");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const router = (0, express_1.Router)();
const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
router.post('/google', async (req, res) => {
    try {
        const idToken = req.body.idToken;
        if (!idToken) {
            return (0, api_errors_1.createServiceError)('idToken manquant', 400);
        }
        console.log('idToken ', idToken);
        console.log('vérification');
        const ticket = await client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID,
        });
        console.log('verify');
        console.log('ticket', ticket);
        const payload = ticket.getPayload();
        if (!payload)
            return res.status(401).json({ error: 'Invalid token' });
        const provider = 'google';
        const providerAccountId = payload.sub;
        const email = payload.email ?? null;
        const emailVerified = !!payload.email_verified;
        const displayName = payload.name ?? '';
        const picture = payload.picture ?? null;
        const givenName = payload.given_name ?? '';
        const familyName = payload.family_name ?? '';
        const user = await (0, auth_user_service_1.upsertOauthUser)({
            provider,
            providerAccountId,
            email,
            emailVerified,
            displayName,
            firstname: givenName,
            lastname: familyName,
            avatar: picture,
            accessToken: undefined,
            refreshToken: undefined,
        });
        console.log('User revonyer par UpsertOauthUser', user);
        const session = await (0, mobile_session_1.createMobileSession)(user);
        console.log('session', session);
        return (0, errorHandler_1.sendApiResponse)(res, 201, {
            ok: true,
            message: 'Authentification réusi avec succé',
            user,
            session,
        });
    }
    catch (err) {
        (0, api_errors_1.createServiceError)('Google token verify failed', 500, err);
    }
});
exports.default = router;
//# sourceMappingURL=google-post.route.js.map