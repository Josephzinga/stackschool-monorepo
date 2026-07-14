import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}
  async sendResetPasswordEmail({
    to,
    subject,
    resetLink,
  }: {
    to: string;
    subject: string;
    resetLink: string;
  }): Promise<void> {
    console.log('resetLink in sendPasswordEmail', resetLink);
    const transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: Number(this.configService.get('EMAIL_PORT')),
      auth: {
        user: this.configService.get('MAILTRAP_USER'),
        pass: this.configService.get('MAILTRAP_PASS'),
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
    try {
      const info = await this.sendEmail(to, subject, html, transporter);
      console.log('Info', info.accepted);
    } catch (err) {
      console.log("Erreur d'envoie email", err);
    }
  }

  async sendWhatsAppCode(phoneNumber: string, code: string) {
    await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(() =>
            console.log('message envoyer', phoneNumber, 'code', code),
          ),
        1000,
      ),
    );
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
  ): Promise<SMTPTransport.SentMessageInfo> {
    return await transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject,
      html,
    });
  }
}
