import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { UserService } from '../../../user/user.service';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { TokenService } from '../token.service';
import { User } from '@stackschool/db-auth';
import { ConfigService } from '@nestjs/config';
import {
  CODE_EXPIRES_MINUTES,
  TEMP_TOKEN_EXP,
} from '../../../../constant/config';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}
  async forgotPassword(
    identifier: ForgotPasswordDto['identifier'],
    res: Response,
  ) {
    const input = identifier.trim();
    try {
      const user = (await Promise.race([
        this.userService.findOne({
          where: {
            OR: [
              { username: { equals: input, mode: 'insensitive' } },
              { phoneNumber: { equals: input, mode: 'insensitive' } },
              { email: { equals: input, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            username: true,
          },
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('forgot-password time out error')),
            2000,
          ),
        ),
      ])) as User;

      if (!user) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500 + Math.random() * 500),
        );

        res.status(HttpStatus.OK).json({
          message:
            'Si un compte correspond à cet identifiant, un message a été envoyé.',
        });
        return;
      }

      const now = new Date();
      const expiresAt = new Date(Date.now() + CODE_EXPIRES_MINUTES * 60 * 1000);

      const { existingCode, existingToken } =
        await this.getExistingVerification(user.id, now);
      const minDelay = 1000 * 60 * 3; // 3 min
      const lastCreated = Math.max(
        existingCode ? new Date(existingCode.createdAt).getTime() : 0,
        existingToken ? new Date(existingToken.createdAt).getTime() : 0,
      );

      if (Date.now() - lastCreated < minDelay) {
        return res.status(HttpStatus.OK).json({
          ok: false,
          message: ' Veuillez patienter avant de redemander un code.',
        });
      }

      await this.markVerificationUsed(user.id);

      let sent = false;
      let sentBy: 'whatsapp' | 'email' = 'email';

      if (input.toLocaleLowerCase() === user.email?.toLocaleLowerCase()) {
        await this.createAndSendByEmail(user.id, user.email, expiresAt);
        sent = true;
      } else if (input === user.phoneNumber) {
        await this.createAndSendByWhatsapp(
          user.id,
          user.phoneNumber,
          expiresAt,
        );
        sent = true;
        sentBy = 'whatsapp';
      } else if (user.email) {
        await this.createAndSendByEmail(user.id, user.email, expiresAt);
        sent = true;
      } else if (user.phoneNumber) {
        await this.createAndSendByWhatsapp(
          user.id,
          user.phoneNumber,
          expiresAt,
        );
        sentBy = 'whatsapp';
        sent = true;
      }

      // Crée un petit JWT temporaire pour réessayer sans redemander l'identifiant
      if (sent && sentBy === 'whatsapp') {
        const tempToken = jwt.sign(
          {
            userId: user.id,
            type: 'resend_code',
            jti: this.tokenService.generateToken(16),
          },
          this.configService.get('JWT_SECRET') as string,

          { expiresIn: TEMP_TOKEN_EXP },
        );

        res.cookie('tempToken', tempToken, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * CODE_EXPIRES_MINUTES,
          secure:
            (this.configService.get('NODE_ENV') as string) === 'production',
        });
        return res.status(HttpStatus.OK).json({
          ok: true,
          message: 'Un code de réinitialisation a été envoyé par WhatsApp.',
          method: 'whatsapp',
        });
      } else if (sent && sentBy === 'email') {
        return res.status(HttpStatus.OK).json({
          ok: true,
          message: 'Un lien de vérification à été envoyer dans votre Email',
        });
      }

      if (!sent) {
        console.warn(`Aucun moyen de contact pour l'utilisateur ${user.id}`);
      }

      return res.status(HttpStatus.OK).json({
        ok: true,
        message: 'Aucun moyen de contact veilliez contacter le support',
      });
    } catch (err) {
      console.error('Erreur interne forgot-password', err);
      res.status(HttpStatus.OK).json({
        ok: true,
        message:
          'Si un compte correspond à cet identifiant, un message vous a été envoyé.',
      });
    }
  }

  private async getExistingVerification(userId: string, time: Date) {
    return await this.prisma.$transaction(async (ctx) => {
      const existingToken = await ctx.verificationToken.findFirst({
        where: {
          userId,
          type: 'password_reset',
          used: false,
          expiresAt: { gt: time },
        },
        orderBy: { createdAt: 'desc' },
      });
      const existingCode = await ctx.verificationCode.findFirst({
        where: {
          userId,
          type: 'password-reset',
          used: false,
          expiresAt: { gt: time },
        },
      });

      return { existingCode, existingToken };
    });
  }
  private async markVerificationUsed(userId: string) {
    await this.prisma.$transaction(async (ctx) => {
      await ctx.verificationToken.updateMany({
        where: {
          userId,
          type: 'password_reset',
          used: false,
        },
        data: { used: true },
      });
      await ctx.verificationCode.updateMany({
        where: {
          userId,
          type: 'password_reset',
          used: false,
        },
        data: { used: true },
      });
    });
  }

  private async createAndSendByEmail(
    userId: string,
    email: string,
    expiresAt: Date,
  ) {
    const rawToken = this.tokenService.generateToken(32);
    const tokenHash = this.tokenService.hashToken(rawToken);

    await this.prisma.verificationToken.create({
      data: {
        userId,
        tokenHash,
        method: 'email',
        type: 'password_reset',
        used: false,
        expiresAt,
      },
    });
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?method=email&token=${rawToken}`;
    try {
      console.log({
        to: email,
        subject: 'password_reset',
        resetLink,
      });
    } catch (err: any) {
      console.error("Erreur lors de l'envoie de l'email", err);
    }
  }

  private async createAndSendByWhatsapp(
    userId: string,
    phoneNumber: string,
    expiresAt: Date,
  ) {
    const rawCode = this.tokenService.generate6Code();
    const codeHash = this.tokenService.hashCode(rawCode);
    await this.prisma.verificationCode.create({
      data: {
        userId,
        codeHash,
        method: 'whatsapp',
        type: 'password_reset',
        used: false,
        attempts: 0,
        expiresAt,
      },
    });

    try {
      void this.notificationsService.sendWhatsAppCode(phoneNumber, rawCode);
    } catch (err) {
      console.error("Erreur lors de l'envoie du code OTP par WhatsApp", err);
    }
  }
}
