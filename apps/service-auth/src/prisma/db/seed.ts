import { PrismaPg } from '@prisma/adapter-pg';
import { Gender, PrismaClient, User } from './generated/client';

const connectionString = `${process.env.DATABASE_URL}`;

export const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

const TARGET_SCHOOL_ID = '3769a14d-9367-4148-b1b5-a1d093bf4939';
const users = [
  {
    username: 'Amadou',
    firstName: 'Amadou',
    lastName: 'Konate',
  },
];

async function main() {
  const userCreatedIds: string[] = [];
  for (const user of users) {
    const u = await prisma.user.create({
      data: {
        email: `${user.username}@stackschool.com`,
        username: user.username,
        password: 'password123',
        phoneNumber: `+243 85${Math.floor(100000 + Math.random() * 900000)}`,
        profileCompleted: true,
        hasMembership: true,
        profile: {
          create: {
            firstName: `${user.firstName}prof`,
            lastName: user.lastName,
            gender: Gender.MALE,
          },
        },
      },
    });
    userCreatedIds.push(u.id);
  }
  console.log('UserIds: \t', userCreatedIds);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
