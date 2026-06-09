"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
const outils_1 = require("../../lib/outils");
const validate_schema_util_1 = require("../../utils/validate-schema.util");
const shared_1 = require("@stackschool/shared");
const api_errors_1 = require("../../utils/api-errors");
const config_1 = require("../../constant/config");
const router = (0, express_1.Router)();
router.post('/reset-password', async (req, res, next) => {
    const { token, password, confirm } = req.body;
    try {
        const errors = (0, validate_schema_util_1.safeValidateSchema)(shared_1.resetPasswordSchema, {
            confirm,
            password,
        });
        if (errors) {
            return next(errors);
        }
        let userIdToReset = null;
        let verificationTokenId = null;
        if (token) {
            const now = new Date();
            const tokenHash = (0, outils_1.hashToken)(token);
            const verificationToken = await prisma_1.prisma.verificationToken.findFirst({
                where: {
                    tokenHash,
                    type: 'password_reset',
                    used: false,
                    expiresAt: { gt: now },
                },
                include: { user: { select: { id: true } } },
            });
            if (!verificationToken || !verificationToken.user) {
                return res.status(400).json({
                    ok: false,
                    message: 'Lien invalide, expiré ou déjà utilisé.',
                });
            }
            userIdToReset = verificationToken.user.id;
            verificationTokenId = verificationToken.id;
        }
        else {
            const resetAccessToken = req.cookies.reset_access_token;
            if (!resetAccessToken) {
                return res.status(400).json({
                    ok: false,
                    message: 'Session expirée ou invalide. Veuillez recommencer la procédure.',
                });
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(resetAccessToken, config_1.JWT_SECRET);
                if (decoded.type !== 'reset_access') {
                    return res
                        .status(400)
                        .json({ ok: false, message: 'Token invalide.' });
                }
                userIdToReset = decoded.userId;
            }
            catch (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Session invalide.',
                });
            }
        }
        if (!userIdToReset) {
            return res.status(400).json({
                ok: false,
                message: "Impossible d'identifier le compte à réinitialiser.",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userIdToReset },
                data: {
                    password: hashedPassword,
                    updatedAt: new Date(),
                },
            });
            if (verificationTokenId) {
                await tx.verificationToken.update({
                    where: { id: verificationTokenId },
                    data: { used: true, updateAt: new Date() },
                });
            }
            await tx.verificationToken.updateMany({
                where: {
                    userId: userIdToReset,
                    type: 'password_reset',
                    used: false,
                },
                data: { used: true },
            });
            await tx.verificationCode.updateMany({
                where: {
                    userId: userIdToReset,
                    type: 'password_reset',
                    used: false,
                },
                data: { used: true },
            });
        });
        res.clearCookie('reset_access_token');
        res.clearCookie('tempToken');
        return res.status(200).json({
            ok: true,
            message: 'Mot de passe réinitialisé avec succès.',
        });
    }
    catch (err) {
        return next((0, api_errors_1.createServiceError)('Erreur lors de la réinitialisation', 500, err));
    }
});
exports.default = router;
//# sourceMappingURL=reset-password.route.js.map