"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_errors_1 = require("../../utils/api-errors");
const facebook_token_service_1 = require("../../services/facebook-token.service");
const auth_user_service_1 = require("../../services/auth-user.service");
const mobile_session_1 = require("../../lib/mobile-session");
const errorHandler_1 = require("../../middlewares/errorHandler");
const router = (0, express_1.Router)();
router.post('/facebook', async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            return (0, api_errors_1.createServiceError)('Access Token missing', 400);
        }
        const profile = await (0, facebook_token_service_1.verifyFacebookToken)(accessToken);
        const user = await (0, auth_user_service_1.upsertOauthUser)({
            provider: 'facebook',
            providerAccountId: profile.id,
            email: profile.email ?? null,
            emailVerified: !!profile.email,
            displayName: profile.name,
            firstname: profile.first_name ?? '',
            lastname: profile.last_name ?? '',
            avatar: profile.avatar ?? null,
            accessToken,
        });
        const session = await (0, mobile_session_1.createMobileSession)(user);
        return (0, errorHandler_1.sendApiResponse)(res, 201, {
            ok: true,
            user,
            session,
            message: 'Authentification réussie avec succès',
        });
    }
    catch (err) {
        throw (0, api_errors_1.createServiceError)('Erreur authentification', 401, err);
    }
});
exports.default = router;
//# sourceMappingURL=facebook-post.route.js.map