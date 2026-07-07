import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TokenService } from '../token.service';
import type { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

interface ResetAccessPayload {
  userId: string;
  type: 'reset_access';
}

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private get jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async execute(
    token: string | undefined,
    password: string,
    req: Request,
    res: Response,
  ): Promise<{ ok: true; message: string }> {
    let userIdToReset: string | null = null;
    let verificationTokenId: string | null = null;

    // --- CAS 1 : Méthode Email (Token dans le body) ---
    if (token) {
      const now = new Date();
      const tokenHash = this.tokenService.hashToken(token);

      const verificationToken = await this.tokenService.findOne({
        tokenHash,
        type: 'password_reset',
        used: false,
        expiresAt: { gt: now },
      });

      if (!verificationToken || !verificationToken.userId) {
        throw new BadRequestException({
          ok: false,
          message: 'Lien invalide, expiré ou déjà utilisé.',
        });
      }

      userIdToReset = verificationToken.userId;
      verificationTokenId = verificationToken.id;
    }
    // --- CAS 2 : Méthode WhatsApp (JWT dans le cookie) ---
    else {
      const resetAccessToken = req.cookies?.reset_access_token as
        string | undefined;
      if (!resetAccessToken) {
        throw new BadRequestException({
          ok: false,
          message:
            'Session expirée ou invalide. Veuillez recommencer la procédure.',
        });
      }

      try {
        const decoded = await this.jwtService.verifyAsync<ResetAccessPayload>(
          resetAccessToken,
          { secret: this.jwtSecret },
        );

        if (decoded.type !== 'reset_access') {
          throw new BadRequestException({
            ok: false,
            message: 'Token invalide.',
          });
        }
        userIdToReset = decoded.userId;
      } catch (err) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException({
          ok: false,
          message: 'Session invalide.',
        });
      }
    }

    if (!userIdToReset) {
      throw new BadRequestException({
        ok: false,
        message: "Impossible d'identifier le compte à réinitialiser.",
      });
    }

    const finalUserId = userIdToReset;
    const hashedPassword = await bcrypt.hash(password, 12);

    await this.prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le mot de passe
      await tx.user.update({
        where: { id: finalUserId },
        data: { password: hashedPassword, updatedAt: new Date() },
      });

      // 2. Si méthode Email : marquer le token comme utilisé
      if (verificationTokenId) {
        await tx.verificationToken.update({
          where: { id: verificationTokenId },
          data: { used: true, updateAt: new Date() },
        });
      }

      // 3. Nettoyage global (tokens + codes non utilisés)
      await tx.verificationToken.updateMany({
        where: { userId: finalUserId, type: 'password_reset', used: false },
        data: { used: true },
      });
      await tx.verificationCode.updateMany({
        where: { userId: finalUserId, type: 'password_reset', used: false },
        data: { used: true },
      });
    });

    res.clearCookie('reset_access_token');
    res.clearCookie('tempToken');

    return {
      ok: true,
      message: 'Mot de passe réinitialisé avec succès.',
    };
  }
}
