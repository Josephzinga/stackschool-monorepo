import { prisma } from '.';
import bcrypt from 'bcryptjs';

async function main() {
  const user = await prisma.user.findMany();
  console.log('user', user);
}
/*

update({
    where: {
      classId: 'cmjwzm3tv0000wenw7j4qau6g',
    },
    data: {
      subject: {
        create: {
          name: 'Mathématique',
          teacherId: 'cmjyma1zs00055vnwa1tjzuq0',
          schoolId: 'cmjrl907d0000y2mv43herxek',
        },
      },
    },
  });
prisma.classSubjects.create({
    data: {
      subject: {
        create: {
          schoolId: 'cmjrl907d0000y2mv43herxek',
          name: 'Physique',
        },
      },
    },
  });
} */
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
