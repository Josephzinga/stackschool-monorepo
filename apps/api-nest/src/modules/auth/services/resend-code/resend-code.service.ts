// src/auth/services/resend-code.service.ts
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TokenService } from '../token.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { RateLimiterService } from '../../../rate-limiter/rate-limiter.service';
import { CODE_EXPIRES_MINUTES } from '../../../../constant/config';

interface ResendCodePayload {
  userId: string;
  type: 'resend_code';
}

@Injectable()
export class ResendCodeService {
  private readonly RESEND_COOLDOWN_MS = 1000 * 60 * 2; // 2 min

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly rateLimiter: RateLimiterService,
  ) {}

  private get jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async execute(req: Request): Promise<{ ok: true; message: string }> {
    // Rate limit anti-spam
    try {
      await this.rateLimiter.consumeResendCode(req);
    } catch {
      throw new HttpException(
        {
          ok: false,
          message: 'Trop de demandes de renvoi. Veuillez réessayer plus tard.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const tempToken = req.cookies?.tempToken as string | undefined;
    if (!tempToken) {
      throw new BadRequestException({
        ok: false,
        message: 'Identifiant ou token requis',
      });
    }

    // Décodage du tempToken
    let decoded: ResendCodePayload;
    try {
      decoded = await this.jwtService.verifyAsync<ResendCodePayload>(
        tempToken,
        { secret: this.jwtSecret },
      );

      if (decoded.type !== 'resend_code') {
        throw new BadRequestException({
          ok: false,
          message: 'Token invalide',
        });
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException({
        ok: false,
        message:
          'Token expiré ou invalide. Veuillez refaire une demande de réinitialisation.',
      });
    }

    const userId = decoded.userId;
    const now = new Date();

    // Vérifier si un code a été envoyé récemment (cooldown 2 min)
    const recentCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId,
        type: 'password_reset',
        method: 'whatsapp',
        createdAt: { gt: new Date(now.getTime() - this.RESEND_COOLDOWN_MS) },
      },
    });

    if (recentCode) {
      const timeLeft = Math.ceil(
        (recentCode.createdAt.getTime() +
          this.RESEND_COOLDOWN_MS -
          now.getTime()) /
          1000,
      );

      throw new BadRequestException({
        ok: false,
        message: `Veuillez patienter ${timeLeft} seconde(s) avant de redemander un code.`,
      });
    }

    // Récupérer les infos utilisateur
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { id: true, phoneNumber: true },
    });

    if (!user || !user.phoneNumber) {
      throw new BadRequestException({
        ok: false,
        message: 'Utilisateur non trouvé ou numéro de téléphone indisponible.',
      });
    }

    // Invalider les anciens codes
    await this.prisma.verificationCode.updateMany({
      where: { userId, type: 'password_reset', used: false },
      data: { used: true },
    });

    // Générer et stocker le nouveau code
    const rawCode = this.tokenService.generate6Code();
    const codeHash = this.tokenService.hashCode(rawCode);
    const expiresAt = new Date(Date.now() + CODE_EXPIRES_MINUTES * 60 * 1000);

    await this.prisma.verificationCode.create({
      data: {
        userId,
        type: 'password_reset',
        method: 'whatsapp',
        attempts: 0,
        expiresAt,
        codeHash,
      },
    });

    // Envoi via le service de notification
    try {
      await this.notificationsService.sendWhatsAppCode(
        user.phoneNumber,
        rawCode,
      );
    } catch (err: any) {
      throw new HttpException(
        {
          ok: false,
          message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        err,
      );
    }

    // Reset du compteur verify-code : l'utilisateur a reçu un nouveau code légitime
    await this.rateLimiter.resetVerifyCodeLimit(req);

    return {
      ok: true,
      message: 'Un nouveau code a été envoyé par WhatsApp.',
    };
  }
}
