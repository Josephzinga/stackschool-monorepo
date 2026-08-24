import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SchoolService } from './school.service';

import {
  CORE_PATTERNS,
  CoreRpcException,
  createSchoolInput,
  SchoolContract,
  ZodValidationPipe,
} from '@stackschool/messaging';

@Controller()
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @MessagePattern(CORE_PATTERNS.SCHOOL.CREATE)
  @UsePipes(new ZodValidationPipe(createSchoolInput))
  create(@Payload() createSchoolDto: any) {
    return this.schoolService.create(createSchoolDto);
  }

  @MessagePattern(CORE_PATTERNS.SCHOOL.FIND_ONE)
  async findOne(
    @Payload()
    data: {
      schoolId: string;
    },
  ): Promise<SchoolContract> {
    const school = await this.schoolService.findOne(data.schoolId);
    if (!school) {
      throw new CoreRpcException('SCHOOL_NOT_FOUND', 'école non trouvé');
    }
    return {
      id: school.id,
      name: school?.name,
      address: school?.address,
      code: school?.code ?? '',
      slug: school?.slug,
      createdAt: school?.createdAt.toDateString(),
      logo: school.logo,
    };
  }

  @MessagePattern(CORE_PATTERNS.SCHOOL.SEARCH)
  async rpcSearch(
    @Payload() data: { searchTerm: string },
  ): Promise<SchoolContract[]> {
    const schools = (await this.schoolService.search(data.searchTerm)) ?? [];
    return schools.map((school) => ({
      id: school.id,
      name: school?.name,
      address: school?.address,
      code: school?.code ?? '',
      slug: school?.slug,
      createdAt: school?.createdAt.toDateString(),
      logo: school.logo,
    }));
  }
}
