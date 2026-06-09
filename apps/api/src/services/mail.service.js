"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendResetPasswordEmail(to, subject, resetLink) {
    console.log('resetLink in sendPasswordEmail', resetLink);
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });
    const html = `
    <p>Bonjour,</p>
    <p>Veuillez utiliser le lien ci-dessous pour réinitialiser votre mot de passe :</p>
   <a href="${resetLink}">${resetLink}</a>
    <p style="margin-top:20px; font-size:14px; color:#555;">
      Si vous n'avez pas demandé cette action, ignorez cet email.
    </p>
  `;
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    });
    console.log('Mail sent:', info.messageId);
}
//# sourceMappingURL=mail.service.js.map