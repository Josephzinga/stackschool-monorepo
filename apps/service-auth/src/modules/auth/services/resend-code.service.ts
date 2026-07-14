import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { TokenService } from './token.service';
import {
  CODE_EXPIRES_MINUTES,
  RESEND_COOLDOWN_SECONDS,
} from '../../../constant/config';
import { AuthRpcException, AUTH_EVENTS } from '@stackschool/messaging';
import { OPERATIONS_SERVICE } from '../../../constant/service.name';
import { ClientProxy, RpcException } from '@nestjs/microservices';

interface ResendCodePayload {
  userId: string;
  type: string;
}

@Injectable()
export class ResendCodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(OPERATIONS_SERVICE) private readonly operationService: ClientProxy,
  ) {}

  private get jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async execute(tempToken: string): Promise<{ ok: true; message: string }> {
    const msg =
      'Token expiré ou invalide. Veuillez refaire une demande de réinitialisation.';
    // Décodage du tempToken
    let decoded: ResendCodePayload;
    try {
      decoded = await this.jwtService.verifyAsync<ResendCodePayload>(
        tempToken,
        { secret: this.jwtSecret },
      );

      if (decoded.type !== 'verify_code') {
        throw new AuthRpcException('INVALID_CREDENTIALS', msg);
      }
    } catch (err) {
      if (err instanceof RpcException) throw err;
      throw new AuthRpcException('INVALID_CREDENTIALS', msg);
    }

    const userId = decoded.userId;
    const now = new Date();

    // Vérifier si un code a été envoyé récemment (cooldown 2 min)
    const recentCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId,
        type: 'password_reset',
        method: 'whatsapp',
        createdAt: { gt: new Date(now.getTime() - RESEND_COOLDOWN_SECONDS) },
      },
    });

    if (recentCode) {
      const timeLeft = Math.ceil(
        (recentCode.createdAt.getTime() +
          RESEND_COOLDOWN_SECONDS -
          now.getTime()) /
          1000,
      );

      throw new AuthRpcException(
        'TOO_MANY_REQUEST',
        `Veuillez patienter ${timeLeft} seconde(s) avant de redemander un code.`,
      );
    }

    // Récupérer les infos utilisateur
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { id: true, phoneNumber: true },
    });

    if (!user || !user.phoneNumber) {
      throw new AuthRpcException(
        'USER_NOT_FOUND',
        'Utilisateur non trouvé ou numéro de téléphone indisponible.',
      );
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

    this.operationService.emit(AUTH_EVENTS.SEND_WHATSAPP_CODE, {
      code: rawCode,
      phoneNumber: user.phoneNumber,
    });

    return {
      ok: true,
      message: 'Un nouveau code a été envoyé par WhatsApp.',
    };
  }
}
