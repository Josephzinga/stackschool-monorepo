import {
  Resolver,
  ResolveField,
  Parent,
  ResolveReference,
} from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { School, SchoolSettings, SchoolStats, Teacher } from '../../graphql';

@Resolver('School')
export class SchoolResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField('settings')
  async getSettings(@Parent() parent: School): Promise<SchoolSettings> {
    const settings = await this.prisma.schoolSettings.findFirst({
      where: {
        schoolId: parent.id,
      },
    });

    return settings!;
  }

  @ResolveField('stats')
  getStats(@Parent() parent: School): Promise<SchoolStats> {
    return null;
  }

  @ResolveField('teachers')
  async getTeachers(@Parent() parent: School): Promise<Teacher[]> {
    const teachers = await this.prisma.teacher.findMany({
      where: {
        schoolUser: {
          schoolId: parent.id,
        },
      },
    });
    return teachers || [];
  }

  @ResolveReference()
  async resolveReference(reference: { _typename: string; id: string }) {
    return this.prisma.school.findUnique({
      where: {
        id: reference.id,
      },
    });
  }
}
