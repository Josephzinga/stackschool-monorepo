"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const api_errors_1 = require("../../utils/api-errors");
const prisma_1 = require("../../lib/prisma");
const outils_1 = require("../../lib/outils");
const router = (0, express_1.Router)();
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        try {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err,
                });
            }
            if (info) {
                if (info?.isSocialOnly) {
                    const providers = Array.isArray(info.providers)
                        ? info.providers.join(',')
                        : info.providers || '';
                    return res.status(403).json({
                        ok: false,
                        isSocialOnly: true,
                        providers,
                        message: 'Compte social uniquement — complétez votre profil.',
                    });
                }
                return next((0, api_errors_1.createServiceError)(info.message, 401));
            }
            if (!user) {
                const msg = info?.message || 'Identifiants invalides';
                return next((0, api_errors_1.createServiceError)(msg, 401));
            }
            req.login(user, async (loginErr) => {
                if (loginErr) {
                    return next((0, api_errors_1.createServiceError)('La connexion a échoué', 500, loginErr));
                }
                const refreshToken = (0, outils_1.generateToken)(32);
                const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);
                await prisma_1.prisma.session.create({
                    data: {
                        sessionToken: refreshToken,
                        userId: user.id,
                        expires,
                    },
                });
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 * 24 * 25,
                });
                return res.json({
                    ok: true,
                    message: 'Authentification reussi avec succès!',
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        phoneNumber: user.phoneNumber,
                        profileCompleted: user.profileCompleted,
                        provider: user.Account.map((acc) => acc.provider).join(','),
                    },
                });
            });
            console.log('user', user);
        }
        catch (error) {
            console.error('Error in local login callback:', error);
            return next(error);
        }
    })(req, res, next);
});
exports.default = router;
//# sourceMappingURL=login.route.js.map