import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { randomInt } from 'crypto';
import { SESSION_EXPIRES_DAY } from '../../../constant/config';
import { Prisma } from '../../../prisma/db/generated/client';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserSession(userId: string) {
    const refreshToken = this.generateToken(16);
    const hashToken = this.hashToken(refreshToken);
    const expires = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRES_DAY,
    );

    const session = await this.prisma.session.create({
      data: {
        userId,
        sessionToken: hashToken,
        expires,
      },
    });

    return {
      ...session,
      sessionToken: refreshToken,
      userId: session.userId as string,
      expires: session.expires.toISOString(),
    };
  }

  async findOne(where: Prisma.VerificationTokenWhereInput) {
    return await this.prisma.verificationToken.findFirst({
      where,
    });
  }

  async create(data: Prisma.VerificationTokenCreateInput) {
    return await this.prisma.verificationToken.create({
      data,
    });
  }

  generateToken(len = 32) {
    return crypto.randomBytes(len).toString('hex');
  }

  hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
  generate6Code() {
    const code = randomInt(100000, 1000000);
    return code.toString();
  }

  hashCode(code: string) {
    return this.hashToken(code);
  }

  randomUUID() {
    return crypto.randomUUID().toString();
  }
}
