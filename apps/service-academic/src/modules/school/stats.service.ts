import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getClassesOccupancy(schoolId: string) {
    const classesOccupancy = await this.prisma.class.findMany({
      where: { schoolId },
      select: {
        name: true,
      },
    });
  }

  async getTotalClasses(schoolId: string) {
    const totalClasses = await this.prisma.class.count({
      where: {
        schoolId,
      },
    });
    return totalClasses || 0;
  }
}
