import { PrismaService } from '../prisma.service';

const prisma = new PrismaService();
let schoolId = '3769a14d-9367-4148-b1b5-a1d093bf4939';
async function main() {
  const existingSchool = await prisma.school.findUnique({
    where: { id: schoolId },
  });
  if (!existingSchool) {
    console.log("⚠️ École cible introuvable, création d'une nouvelle école...");
    const newSchool = await prisma.school.create({
      data: {
        name: 'Lycée Moderne de Bamako (Seed)',
        address: 'Bamako, Mali',
        code: `LMB${Math.floor(Math.random() * 1000)}`,
        slug: `lycee-moderne-bamako-${Date.now()}`,
      },
    });
    schoolId = newSchool.id;
    console.log(`🏫 Nouvelle école créée : ${schoolId}`);
  } else {
    console.log(
      `🏫 Utilisation de l'école existante : ${existingSchool.name} (${schoolId})`,
    );
  }
}

void main();
