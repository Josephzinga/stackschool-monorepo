"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outils_1 = require("../../lib/outils");
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const api_errors_1 = require("../../utils/api-errors");
const router = (0, express_1.Router)();
router.post('/refresh', async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken)
            throw (0, api_errors_1.createServiceError)('Aucun token de rafraîchissement.', 401);
        const dbSession = await prisma_1.prisma.session.findUnique({
            where: { sessionToken: refreshToken },
        });
        if (!dbSession || dbSession.expires < new Date()) {
            if (dbSession) {
                await prisma_1.prisma.session.delete({
                    where: { id: dbSession.id },
                });
            }
            res.clearCookie('refresh_token');
            throw (0, api_errors_1.createServiceError)('Token de rafraîchissement invalide ou expiré.', 401);
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: dbSession.userId },
            include: { profile: true },
        });
        if (!user) {
            await prisma_1.prisma.session.delete({
                where: { id: dbSession.id },
            });
            res.clearCookie('refresh_token');
            throw (0, api_errors_1.createServiceError)('Utilisateur non trouvé.', 401);
        }
        await new Promise((resolve, reject) => {
            req.login(user, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
        await prisma_1.prisma.session.delete({
            where: { id: dbSession.id },
        });
        const newRefreshToken = (0, outils_1.generateToken)(32);
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);
        await prisma_1.prisma.session.create({
            data: {
                sessionToken: newRefreshToken,
                userId: user.id,
                expires,
            },
        });
        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 25,
        });
        return res.json({ ok: true });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=refresh.route.js.map