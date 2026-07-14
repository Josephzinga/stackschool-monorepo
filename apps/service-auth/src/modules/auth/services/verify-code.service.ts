import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRpcException } from '@stackschool/messaging';
import { PrismaService } from '../../../prisma/prisma.service';
import { TokenService } from './token.service';
import { RESET_TOKEN_EXP_MINUTES } from '../../../constant/config';
import type { VerifyCodeResponse } from '@stackschool/messaging';

interface ResendCodePayload {
  userId: string;
  type: string;
}

@Injectable()
export class VerifyCodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private get jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async execute(code: string, tempToken: string): Promise<VerifyCodeResponse> {
    // Décodage du tempToken JWT
    let userId: string;
    try {
      const decoded = await this.jwtService.verifyAsync<ResendCodePayload>(
        tempToken,
        { secret: this.jwtSecret },
      );

      if (decoded?.type !== 'verify_code') {
        throw new AuthRpcException('INVALID_CREDENTIALS', 'Token invalide.');
      }
      userId = decoded.userId;
    } catch (err) {
      throw new AuthRpcException(
        'INVALID_CREDENTIALS',
        'Token expiré ou invalide',
      );
    }

    const codeHash = this.tokenService.hashCode(code);
    const now = new Date();

    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId,
        method: 'whatsapp',
        type: 'password_reset',
        expiresAt: { gt: now },
        used: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verificationCode) {
      throw new AuthRpcException(
        'INVALID_CREDENTIALS',
        'Code invalide ou expiré',
      );
    }

    // Vérification du nombre de tentatives
    if (verificationCode.attempts >= 5) {
      throw new AuthRpcException(
        'TOO_MANY_REQUEST',
        'Trop de tentative veuillez ressayer plus tard',
      );
    }

    // Vérification du hash du code
    if (verificationCode.codeHash !== codeHash) {
      await this.prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { attempts: { increment: 1 } },
      });

      const remainingAttempts = 5 - (verificationCode.attempts + 1);

      throw new AuthRpcException(
        'INVALID_CREDENTIALS',
        `Code incorrect. ${remainingAttempts} tentative(s) restante(s).`,
        { remainingAttempts },
      );
    }

    // Code valide → marquer comme utilisé + invalider les autres
    await this.prisma.$transaction(async (tx) => {
      await tx.verificationCode.update({
        where: { id: verificationCode.id },
        data: { used: true, updateAt: new Date() },
      });

      await tx.verificationCode.updateMany({
        where: { userId, type: 'password_reset', used: false },
        data: { used: true },
      });
    });

    // Génération du JWT reset_access (valide RESET_TOKEN_EXP_MINUTES)
    const resetAccessToken = await this.jwtService.signAsync(
      { userId, type: 'reset_access' },
      {
        secret: this.jwtSecret,
        expiresIn: `${RESET_TOKEN_EXP_MINUTES}m`,
      },
    );

    return {
      ok: true,
      message: 'Code vérifié avec succès.',
      resetAccessToken,
    };
  }
}
