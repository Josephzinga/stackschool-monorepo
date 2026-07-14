import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { CODE_EXPIRES_MINUTES, TEMP_TOKEN_EXP } from '../../../constant/config';
import { ForgotPasswordResponse, AUTH_EVENTS } from '@stackschool/messaging';
import { OPERATIONS_SERVICE } from '../../../constant/service.name';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(OPERATIONS_SERVICE)
    private readonly operationService: ClientProxy,
  ) {}
  async execute(identifier: string): Promise<ForgotPasswordResponse> {
    const input = identifier.trim();
    const genericMessage =
      'Si un compte existe, un lien de vérification a été envoyé par email ou un code par WhatsApp.';

    const user = await this.userService.findByIdentifier(input);

    // Délai anti-timing appliqué dans TOUS les cas, pas seulement si user absent
    const artificialDelay = 300 + Math.random() * 400;

    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, artificialDelay));
      return { ok: true, message: genericMessage }; // pas de tempToken : rien à vérifier ensuite
    }

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + CODE_EXPIRES_MINUTES * 60 * 1000,
    );

    const { existingCode, existingToken } = await this.getExistingVerification(
      user.id,
      now,
    );
    const minDelay = 1000 * 60 * 3;
    const lastCreated = Math.max(
      existingCode ? new Date(existingCode.createdAt).getTime() : 0,
      existingToken ? new Date(existingToken.createdAt).getTime() : 0,
    );

    if (Date.now() - lastCreated < minDelay) {
      return {
        ok: false,
        message: 'Veuillez patienter avant de redemander un code.',
      };
    }

    await this.markVerificationUsed(user.id);

    const method: 'email' | 'whatsapp' =
      input.toLowerCase() === user.email?.toLowerCase()
        ? 'email'
        : input === user.phoneNumber
          ? 'whatsapp'
          : user.email
            ? 'email'
            : 'whatsapp';

    if (method === 'email') {
      await this.createAndSendByEmail(user.id, user.email!, expiresAt);
      return { ok: true, message: genericMessage, method }; // pas de tempToken
    }

    // Uniquement ici : génération + signature du tempToken, lié au VRAI user.id
    const tempToken = this.jwtService.sign(
      {
        userId: user.id,
        type: 'verify_code',
        jti: this.tokenService.generateToken(16),
      },
      {
        expiresIn: TEMP_TOKEN_EXP,
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    await this.createAndSendByWhatsapp(user.id, user.phoneNumber!, expiresAt);
    return { ok: true, message: genericMessage, method, tempToken };
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

    return this.operationService.emit(AUTH_EVENTS.SEND_EMAIL_LINK, {
      to: email,
      subject: 'forgot-password',
      resetLink,
    });
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

    return this.operationService.emit(AUTH_EVENTS.SEND_WHATSAPP_CODE, {
      phoneNumber,
      code: rawCode,
    });
  }
}
