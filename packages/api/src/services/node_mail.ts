import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export async function sendMail(to: string, subject: string, resetLink: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  } as SMTPTransport.Options);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: `
    <p>Bonjour,</p>
    <p>Veuillez utiliser le lien ci-dessous pour réinitialiser votre mot de passe :</p>
   <a href=${resetLink}>${resetLink}</a>
    <p style="margin-top:20px; font-size:14px; color:#555;">
      Si vous n'avez pas demandé cette action, ignorez cet email.
    </p>
  `,
  });
  console.log("Mail sent:", info.messageId);
}
