import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';
import type { UserInMe } from '@stackschool/shared';

interface VerifiedData {
  email?: string;
  phoneNumber?: string;
  selfCheck: boolean;
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async validateUserField(res: Response, data: VerifiedData, user: UserInMe) {
    const { selfCheck, email, phoneNumber } = data;
    // check email uniqueness
    if (selfCheck ? data.email && user?.email !== email : email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.json({
          ok: true,
          valid: false,
          field: 'email',
          message: 'Cette valeur est déjà utilisée.',
        });
      }
    }

    if (
      selfCheck
        ? phoneNumber &&
          user?.phoneNumber?.replace(/\s+/g, '') !==
            phoneNumber?.replace(/\s+/g, '')
        : phoneNumber
    ) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          phoneNumber: phoneNumber?.replace(/\s+/g, ''),
        },
      });

      if (existingUser) {
        return res.json({
          ok: true,
          valid: false,
          field: 'phone',
          message: 'Cette valeur est déjà utilisée.',
        });
      }
    }

    // everything ok
    return res.json({
      ok: true,
      valid: true,
    });
  }
  catch(err) {
    throw new InternalServerErrorException(
      "Erreur de vérification de l'email ou numéro de téléphone",
      err,
    );
  }
}
