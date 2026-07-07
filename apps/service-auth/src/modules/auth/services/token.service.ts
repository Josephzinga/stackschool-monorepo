import { Session } from '@stackschool/db-auth';
import { generateToken } from '../../../utils/generate-token';
import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { randomInt } from 'crypto';
import { Prisma } from '@stackschool/db-auth';

const SESSION_EXPIRES_DAY = Number(process.env.SESSION_EXPIRES_DAY ?? '25');

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserSession(userId: string): Promise<Session> {
    const refreshToken = generateToken(16);
    const expires = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRES_DAY,
    );

    const session = await this.prisma.session.create({
      data: {
        userId,
        sessionToken: refreshToken,
        expires,
      },
    });

    return session;
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
}
