import { Gender, User } from '../prisma/db/generated/client';
import { PrismaService } from '../prisma/prisma.service';

const prisma = new PrismaService();
const usernames = [''];

async function main() {
  const users: User[] = [];
  for (const username of usernames) {
    const user = await prisma.user.create({
      data: {
        email: `${username}@stackschool.com`,
        username: username,
        password: 'password123',
        phoneNumber: `+243 85${Math.floor(100000 + Math.random() * 900000)}`,
        profileCompleted: true,
        hasMembership: true,
        profile: {
          create: {
            firstName: `${username}.prof`,
            lastName: '',
            gender: Gender.MALE,
          },
        },
      },
    });
    users.push(user);
  }

  console.log([users.map((u) => u.id)]);
}

main();
