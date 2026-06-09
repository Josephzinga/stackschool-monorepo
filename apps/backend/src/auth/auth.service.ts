import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { prisma } from '@stackschool/db';

@Injectable()
export class AuthService {
  register(registerDto: RegisterDto): string {
    console.log('register', registerDto);
    const { phoneNumber, email, password, username } = registerDto;
    const exist = prisma.user.findFirst({
      where: {},
    });

    return 'Compte crée avec succès';
  }

  private async findUserByIdentifier(item?: RegisterDto | string) {
    const username = typeof item === 'string' ? item : item?.username;
  }
}
