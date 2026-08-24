import {
  Args,
  Parent,
  Query,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import {
  School,
  SchoolSearchInput,
  SchoolSettings,
  Teacher,
} from '../../graphql';
import { SchoolService } from './school.service';
import { BadRequestException } from '@nestjs/common';

@Resolver('School')
export class SchoolResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schoolService: SchoolService,
  ) {}

  @Query('school')
  async getSchool(@Args('schoolId') id: string): Promise<School | null> {
    const school = await this.schoolService.findUnique({
      id,
    });
    return school;
  }

  @Query('searchSchool')
  async searchSchool(@Args('filter') dto: SchoolSearchInput) {
    if (!dto?.searchTerm || dto.searchTerm.length < 2)
      throw new BadRequestException(
        'Le terme de recherche dois contenir au moins 2 caractères.',
      );
    const school = this.schoolService.search(dto.searchTerm?.trim());
    return school;
  }

  @ResolveField('settings')
  async getSettings(@Parent() parent: School): Promise<SchoolSettings> {
    const settings = await this.prisma.schoolSettings.findFirst({
      where: {
        schoolId: parent.id,
      },
    });

    return settings!;
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

  @ResolveField('stats')
  async getStats(@Parent() parent: School): Promise<School['stats'] | null> {
    const stats = await this.schoolService.getSchoolStats(parent.id);
    return stats;
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
