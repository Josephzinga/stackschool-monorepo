"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const limiter_1 = require("../../utils/limiter");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../constant/config");
const prisma_1 = require("../../lib/prisma");
const outils_1 = require("../../lib/outils");
const whatsapp_service_1 = __importDefault(require("../../services/whatsapp.service"));
const router = (0, express_1.Router)();
router.post('/resend-code', async (req, res) => {
    try {
        try {
            await (0, limiter_1.consumeResendCode)(req);
        }
        catch (RateLimiterQueueError) {
            return res.status(429).json({
                ok: false,
                message: 'Trop de demandes de renvoi. Veuillez réessayer plus tard.',
            });
        }
        const tempToken = req.cookies.tempToken;
        if (!tempToken) {
            return res.status(400).json({
                ok: false,
                message: 'Identifiant ou token requis',
            });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(tempToken, config_1.JWT_SECRET);
            if (decoded.type !== 'resend_code') {
                return res.status(400).json({
                    ok: false,
                    message: 'Token invalide',
                });
            }
        }
        catch (jwtError) {
            return res.status(400).json({
                ok: false,
                message: 'Token expiré ou invalide. Veuillez refaire une demande de réinitialisation.',
            });
        }
        const userId = decoded.userId;
        const now = new Date();
        const delay = 1000 * 60 * 2;
        const recentCode = await prisma_1.prisma.verificationCode.findFirst({
            where: {
                userId,
                type: 'password_reset',
                method: 'whatsapp',
                createdAt: { gt: new Date(now.getTime() - delay) },
            },
        });
        if (recentCode) {
            const timeLeft = Math.ceil((recentCode.createdAt.getTime() + delay - now.getTime()) / 1000);
            return res.status(400).json({
                ok: false,
                message: `Veuillez patienter ${timeLeft} seconde(s) avant de redemander un code.`,
            });
        }
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId },
            select: { id: true, phoneNumber: true },
        });
        if (!user || !user.phoneNumber) {
            return res.status(400).json({
                ok: false,
                message: 'Utilisateur non trouvé ou numéro de téléphone indisponible.',
            });
        }
        await prisma_1.prisma.verificationCode.updateMany({
            where: { userId, type: 'password_reset', used: false },
            data: { used: true },
        });
        const rawCode = (0, outils_1.generate6Code)();
        const codeHash = (0, outils_1.hashCode)(rawCode);
        const expiresAt = new Date(Date.now() + config_1.CODE_EXPIRES_MINUTES * 60 * 1000);
        await prisma_1.prisma.verificationCode.create({
            data: {
                userId,
                type: 'password_reset',
                method: 'whatsapp',
                attempts: 0,
                expiresAt,
                codeHash,
            },
        });
        try {
            await (0, whatsapp_service_1.default)(user.phoneNumber, rawCode);
        }
        catch (err) {
            console.error('Erreur WhatsApp lors du renvoi:', err);
            return res.status(500).json({
                ok: false,
                message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
            });
        }
        await (0, limiter_1.resetVerifyCodeLimit)(req);
        return res.status(200).json({
            ok: true,
            message: 'Un nouveau code a été envoyé par WhatsApp.',
        });
    }
    catch (error) {
        console.error('resend-code error:', error);
        return res.status(500).json({
            ok: false,
            message: 'Erreur lors du renvoi du code',
        });
    }
});
exports.default = router;
//# sourceMappingURL=resend-code.route.js.map