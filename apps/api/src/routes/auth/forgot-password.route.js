"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("@stackschool/db");
const mail_service_1 = require("../../services/mail.service");
const whatsapp_service_1 = __importDefault(require("../../services/whatsapp.service"));
const outils_1 = require("../../lib/outils");
const config_1 = require("../../constant/config");
const limiter_1 = require("../../utils/limiter");
const api_errors_1 = require("../../utils/api-errors");
const errorHandler_1 = require("../../middlewares/errorHandler");
const forgotPasswordRoute = async (req, res, next) => {
    try {
        try {
            await (0, limiter_1.consumeIp)(req);
            await (0, limiter_1.consumeIdentifier)(req);
        }
        catch (RateLimiterQueueError) {
            return next((0, api_errors_1.createServiceError)('Trop de tentatives. Veuillez réessayer plus tard', 429));
        }
        console.log('Forgot password route', req.body?.identifier);
        const { identifier } = req.body;
        console.log('identifier', identifier);
        const user = (await Promise.race([
            db_1.prisma.user.findFirst({
                where: {
                    OR: [
                        { username: { equals: identifier, mode: 'insensitive' } },
                        { phoneNumber: { equals: identifier, mode: 'insensitive' } },
                        { email: { equals: identifier, mode: 'insensitive' } },
                    ],
                },
                select: {
                    id: true,
                    email: true,
                    phoneNumber: true,
                    username: true,
                },
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
        ]));
        console.log('user', user);
        if (!user) {
            await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
            return (0, errorHandler_1.sendApiResponse)(res, 200, {
                ok: false,
                message: 'Si un compte correspond à cet identifiant, un message a été envoyé.',
            });
        }
        const now = new Date();
        const expiresAt = new Date(Date.now() + config_1.CODE_EXPIRES_MINUTES * 60 * 1000);
        const [existingToken, existingCode] = await Promise.all([
            db_1.prisma.verificationToken.findFirst({
                where: {
                    userId: user.id,
                    type: 'password_reset',
                    used: false,
                    expiresAt: { gt: now },
                },
                orderBy: { createdAt: 'desc' },
            }),
            db_1.prisma.verificationCode.findFirst({
                where: {
                    userId: user.id,
                    type: 'password-reset',
                    used: false,
                    expiresAt: { gt: now },
                },
            }),
        ]);
        const minDelay = 1000 * 60 * 2;
        const lastCreated = Math.max(existingCode ? new Date(existingCode.createdAt).getTime() : 0, existingToken ? new Date(existingToken.createdAt).getTime() : 0);
        if (Date.now() - lastCreated < minDelay) {
            (0, errorHandler_1.sendApiResponse)(res, 200, {
                ok: false,
                message: ' Veuillez patienter avant de redemander un code.',
            });
            return;
        }
        await Promise.all([
            db_1.prisma.verificationToken.updateMany({
                where: {
                    userId: user.id,
                    type: 'password_reset',
                    used: false,
                },
                data: { used: true },
            }),
            db_1.prisma.verificationCode.updateMany({
                where: {
                    userId: user.id,
                    type: 'password_reset',
                    used: false,
                },
                data: { used: true },
            }),
        ]);
        let sent = false;
        if (user.email.toLowerCase() === identifier.toLowerCase() ||
            user.username.toLowerCase() === identifier.toLowerCase()) {
            const rawToken = (0, outils_1.generateToken)(32);
            const tokenHash = (0, outils_1.hashToken)(rawToken);
            await db_1.prisma.verificationToken.create({
                data: {
                    userId: user.id,
                    tokenHash,
                    method: 'email',
                    type: 'password_reset',
                    used: false,
                    expiresAt,
                },
            });
            const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?method=email&token=${rawToken}`;
            try {
                await (0, mail_service_1.sendResetPasswordEmail)(user.email, 'password_reset', resetLink);
                sent = true;
            }
            catch (err) {
                (0, api_errors_1.createServiceError)('Erreur envoi email:', 400, err);
            }
            return res.status(200).json({
                ok: true,
                message: 'Un lien de réinitialisation du mot de passe a été envoyé à votre email.',
                method: 'email',
            });
        }
        if (!sent && user.phoneNumber) {
            const rawCode = (0, outils_1.generate6Code)();
            const codeHash = (0, outils_1.hashCode)(rawCode);
            await db_1.prisma.verificationCode.create({
                data: {
                    userId: user.id,
                    codeHash,
                    method: 'whatsapp',
                    type: 'password_reset',
                    used: false,
                    attempts: 0,
                    expiresAt,
                },
            });
            try {
                await (0, whatsapp_service_1.default)(user.phoneNumber, rawCode);
                sent = true;
            }
            catch (err) {
                return (0, api_errors_1.createServiceError)("Erreur d'envoie du message whatsapp", 500, err);
            }
            const tempToken = jsonwebtoken_1.default.sign({
                userId: user.id,
                type: 'resend_code',
                jti: (0, outils_1.generateToken)(16),
            }, config_1.JWT_SECRET, { expiresIn: config_1.TEMP_TOKEN_EXP });
            res.cookie('tempToken', tempToken, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * config_1.CODE_EXPIRES_MINUTES,
                secure: process.env.NODE_ENV === 'production',
            });
            return res.status(200).json({
                ok: true,
                message: 'Un code de réinitialisation a été envoyé par WhatsApp.',
                method: 'whatsapp',
            });
        }
        if (!sent) {
            console.warn(`Aucun moyen de contact pour l'utilisateur ${user.id}`);
        }
        return res.status(200).json({
            ok: true,
            message: 'Aucun moyen de contact veilliez contacter le support',
        });
    }
    catch (err) {
        return next((0, api_errors_1.createServiceError)('Si un compte correspond à cet identifiant, un message vous a été envoyé.', 500, err));
    }
};
exports.forgotPasswordRoute = forgotPasswordRoute;
//# sourceMappingURL=forgot-password.route.js.map