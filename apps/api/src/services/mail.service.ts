import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

/**
 * Envoie un email de réinitialisation de mot de passe.
 *
 * @param {string} to - L'adresse email du destinataire.
 * @param {string} subject - Le sujet de l'email.
 * @param {string} resetLink - Le lien de réinitialisation à inclure dans le corps de l'email.
 * @returns {Promise<void>}
 */
export async function sendResetPasswordEmail(
  to: string,
  subject: string,
  resetLink: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  } as SMTPTransport.Options);

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
