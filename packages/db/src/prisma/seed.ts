import {prisma} from '.';

async function main() {
  try {
    const classes = await prisma.class.create({
      data: {
        schoolId: 'cmjrl907d0000y2mv43herxek',
        teacherId: 'cmjrldyvx00001cmvvsss9k40',
        section: 'Chimie',
        name: 'CLASS C',
        level: '5iéme année',
      },
    });
  } catch (e) {
    console.log('Erreur', e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
