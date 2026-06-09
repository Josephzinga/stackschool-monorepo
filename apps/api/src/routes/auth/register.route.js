"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("@stackschool/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const outils_1 = require("../../lib/outils");
const api_errors_1 = require("../../utils/api-errors");
const shared_1 = require("@stackschool/shared");
const validate_schema_util_1 = require("../../utils/validate-schema.util");
const router = (0, express_1.Router)();
function sendApiResponse(res, statusCode, data) {
    const ok = statusCode >= 200 && statusCode < 300;
    return res.status(statusCode).json({
        ok,
        ...data,
    });
}
async function sendWhatsAppCode(phoneNumber, code) {
    console.log(`code: ${code} numéro: ${phoneNumber} `);
}
router.post('/register', async (req, res, next) => {
    try {
        const { data, errors, success } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.registerFormSchema, req.body);
        if (!success) {
            return next(errors);
        }
        const { email, password, username, phoneNumber } = data;
        const safeEmail = email?.trim() || undefined;
        const safePhone = phoneNumber?.trim() || undefined;
        const existing = await db_1.prisma.user.findFirst({
            where: {
                isActive: true,
                OR: [{ username }, { email: safeEmail }, { phoneNumber: safePhone }],
            },
        });
        if (existing) {
            if (safeEmail && existing?.email === safeEmail) {
                throw (0, api_errors_1.createServiceError)('Email déjà utilisé', 409);
            }
            if (existing?.username === username) {
                throw (0, api_errors_1.createServiceError)("Nom d'utilisateur déjà utilisé", 409);
            }
            if (safePhone && existing.phoneNumber === safePhone) {
                throw (0, api_errors_1.createServiceError)('Numéro de téléphone déjà utilisé', 409);
            }
        }
        const hashed = await bcryptjs_1.default.hash(password, 12);
        const user = await db_1.prisma.user.create({
            data: {
                email: safeEmail,
                password: hashed,
                username,
                isVerified: false,
                phoneNumber: safePhone,
            },
            include: { profile: true, Account: true },
        });
        if (phoneNumber) {
            const code = (0, outils_1.generate6Code)();
            const codeHash = (0, outils_1.hashCode)(code);
            const expiresAt = new Date(Date.now() + 1000 * 60 * 15);
            await db_1.prisma.verificationCode.deleteMany({
                where: {
                    userId: user.id,
                },
            });
            await db_1.prisma.verificationCode.create({
                data: {
                    codeHash,
                    expiresAt,
                    userId: user.id,
                },
            });
            try {
                await sendWhatsAppCode(phoneNumber, code);
            }
            catch (sendErr) {
                console.error('Erreur envoi WhatsApp:', sendErr);
            }
        }
        req.login(user, async (err) => {
            if (err) {
                return next((0, api_errors_1.createServiceError)("La connexion après l'inscription a échoué", 500, err));
            }
            const refreshToken = (0, outils_1.generateToken)(32);
            const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);
            await Promise.all([
                db_1.prisma.session.create({
                    data: {
                        sessionToken: refreshToken,
                        userId: user.id,
                        expires,
                    },
                }),
                db_1.prisma.account.create({
                    data: {
                        provider: 'local',
                        providerAccountId: user.id,
                        userId: user.id,
                    },
                }),
            ]);
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 25,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            });
            if (phoneNumber) {
                return sendApiResponse(res, 201, {
                    message: 'Inscription réussie. Vérifiez votre numéro de téléphone.',
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        profileCompleted: user.profileCompleted,
                        provider: 'local',
                    },
                    requireVerification: true,
                });
            }
            return sendApiResponse(res, 201, {
                message: 'Inscription réussie',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    provider: 'local',
                },
                profileCompleted: user.profileCompleted,
            });
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=register.route.js.map