import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TokenService } from '../token.service';
import { RESET_TOKEN_EXP_MINUTES } from '../../../../constant/config';

interface ResendCodePayload {
  userId: string;
  type: 'resend_code';
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

  async execute(
    code: string,
    req: Request,
    res: Response,
  ): Promise<{ ok: true; message: string }> {
    const tempToken = req.cookies?.tempToken as string;
    if (!tempToken) {
      throw new BadRequestException({
        ok: false,
        message: 'Identifiant ou token requis',
      });
    }

    // Décodage du tempToken JWT
    let userId: string;
    try {
      const decoded = await this.jwtService.verifyAsync<ResendCodePayload>(
        tempToken,
        { secret: this.jwtSecret },
      );

      if (decoded?.type !== 'resend_code') {
        throw new BadRequestException({
          ok: false,
          message: 'Token invalide',
        });
      }
      userId = decoded.userId;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException({
        ok: false,
        message: 'Token expiré ou invalide',
      });
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
      throw new NotFoundException({
        ok: false,
        message: 'Code invalide ou expiré',
      });
    }

    // Vérification du nombre de tentatives
    if (verificationCode.attempts >= 5) {
      throw new BadRequestException({
        ok: false,
        message: 'Trop de tentatives. Veuillez demander un nouveau code.',
      });
    }

    // Vérification du hash du code
    if (verificationCode.codeHash !== codeHash) {
      await this.prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { attempts: { increment: 1 } },
      });

      const remainingAttempts = 5 - (verificationCode.attempts + 1);

      throw new BadRequestException({
        ok: false,
        message: `Code incorrect. ${remainingAttempts} tentative(s) restante(s).`,
        remainingAttempts,
      });
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

    // Cookie sécurisé
    res.cookie('reset_access_token', resetAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: RESET_TOKEN_EXP_MINUTES * 60 * 1000,
    });

    // Le tempToken n'est plus nécessaire
    res.clearCookie('tempToken');

    return {
      ok: true,
      message: 'Code vérifié avec succès.',
    };
  }
}
