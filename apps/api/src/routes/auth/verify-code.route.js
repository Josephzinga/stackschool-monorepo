"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const outils_1 = require("../../lib/outils");
const limiter_1 = require("../../utils/limiter");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../constant/config");
const api_errors_1 = require("../../utils/api-errors");
const router = (0, express_1.Router)();
router.post('/verify-code', async (req, res, next) => {
    try {
        try {
            await (0, limiter_1.consumeCode)(req);
        }
        catch (RateLimiterQueueError) {
            return next((0, api_errors_1.createServiceError)('Trop de tentatives. Veuillez réessayer plus tard', 429));
        }
        const { code } = req.body;
        const tempToken = req.cookies.tempToken;
        if (!tempToken) {
            return res.status(400).json({
                ok: false,
                message: 'Identifiant ou token requis',
            });
        }
        let userId;
        try {
            const decoded = jsonwebtoken_1.default.verify(tempToken, config_1.JWT_SECRET);
            if (decoded?.type !== 'resend_code') {
                return res.status(400).json({ ok: false, message: 'Token invalide' });
            }
            userId = decoded.userId;
        }
        catch (jwtError) {
            return res
                .status(400)
                .json({ ok: false, message: 'Token expiré ou invalide' });
        }
        const codeHash = (0, outils_1.hashCode)(code);
        const now = new Date();
        const verificationCode = await prisma_1.prisma.verificationCode.findFirst({
            where: {
                userId,
                method: 'whatsapp',
                type: 'password_reset',
                expiresAt: { gt: now },
                used: false,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!verificationCode) {
            return res
                .status(404)
                .json({ ok: false, message: 'Code invalide ou expiré' });
        }
        if (verificationCode.attempts >= 5) {
            return res.status(400).json({
                ok: false,
                message: 'Trop de tentatives. Veuillez demander un nouveau code.',
            });
        }
        if (verificationCode.codeHash !== codeHash) {
            await prisma_1.prisma.verificationCode.update({
                where: { id: verificationCode.id },
                data: { attempts: { increment: 1 } },
            });
            const remainingAttempts = 5 - (verificationCode.attempts + 1);
            return res.status(400).json({
                ok: false,
                message: `Code incorrect. ${remainingAttempts} tentative(s) restante(s).`,
                remainingAttempts,
            });
        }
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.verificationCode.update({
                where: { id: verificationCode.id },
                data: { used: true, updateAt: new Date() },
            });
            await tx.verificationCode.updateMany({
                where: { userId, type: 'password_reset', used: false },
                data: { used: true },
            });
        });
        const resetAccessToken = jsonwebtoken_1.default.sign({ userId, type: 'reset_access' }, config_1.JWT_SECRET, { expiresIn: `${config_1.RESET_TOKEN_EXP_MINUTES}m` });
        res.cookie('reset_access_token', resetAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config_1.RESET_TOKEN_EXP_MINUTES * 60 * 1000,
        });
        res.clearCookie('tempToken');
        return res.status(200).json({
            ok: true,
            message: 'Code vérifié avec succès.',
        });
    }
    catch (err) {
        return next((0, api_errors_1.createServiceError)('Erreur lors de la vérification du code', 500, err));
    }
});
exports.default = router;
//# sourceMappingURL=verify-code.route.js.map