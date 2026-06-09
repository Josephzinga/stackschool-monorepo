"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocialWebCallback = handleSocialWebCallback;
const session_service_1 = require("../services/session.service");
const api_errors_1 = require("../utils/api-errors");
async function handleSocialWebCallback(req, res, next, provider) {
    try {
        const baseUrl = process.env.FRONTEND_URL;
        const user = req?.user;
        if (!user || !user?.id) {
            return res.redirect(`${baseUrl}/auth/login=error`);
        }
        const { refreshToken, expires } = await (0, session_service_1.createUserSession)(user.id);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: expires.getTime() - Date.now(),
        });
        if (!user?.profileCompleted) {
            return res.redirect(`${baseUrl}/auth/complete-profile`);
        }
        return res.redirect(`${baseUrl}/dashboard`);
    }
    catch (error) {
        next((0, api_errors_1.createServiceError)(`Error get ${provider} callback: `, 500, error));
    }
}
//# sourceMappingURL=social-web.controller.js.map