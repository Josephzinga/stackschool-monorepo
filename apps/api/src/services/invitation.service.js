"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndSendInvitation = createAndSendInvitation;
const db_1 = require("@stackschool/db");
const outils_1 = require("../lib/outils");
const mail_service_1 = require("./mail.service");
const whatsapp_service_1 = __importDefault(require("./whatsapp.service"));
async function createAndSendInvitation(params) {
    const { schoolId, role, email, phoneNumber, message } = params;
    const code = (0, outils_1.generate6Code)();
    const hashCode = hashCode(code);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const invitation = await db_1.prisma.invite.create({
        data: {
            schoolId,
            role,
            email,
            phoneNumber,
            token: tokenHash,
            expiresAt,
            message: message ||
                `Vous êtes invité à rejoindre notre école en tant que ${role.toLowerCase()}.`,
        },
    });
    const joinUrl = `${process.env.FRONTEND_URL}/join?token=${token}`;
    if (email) {
        await (0, mail_service_1.sendResetPasswordEmail)(email, 'Invitation à rejoindre notre école', joinUrl);
    }
    if (phoneNumber) {
        const whatsappMessage = `${invitation.message} Cliquez ici pour accepter : $}`;
        const code = (0, outils_1.generate6Code)();
        await (0, whatsapp_service_1.default)(phoneNumber, code);
    }
    return invitation;
}
//# sourceMappingURL=invitation.service.js.map