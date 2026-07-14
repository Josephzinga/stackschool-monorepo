import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSchoolInput } from './dto/create-school.input';
import { UpdateSchoolInput } from './dto/update-school.input';
import {
  CORE_PATTERNS,
  CORE_SERVICE,
  SchoolContract,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { validateWith } from '../../utils/validate.operator';

@Injectable()
export class SchoolService {
  constructor(
    @Inject(CORE_SERVICE) private readonly coreService: ClientProxy,
  ) {}
  async findById(id: string) {
    const school = await firstValueFrom<SchoolContract>(
      this.coreService
        .send(CORE_PATTERNS.SCHOOL.FIND_ONE, { schoolId: id })

        .pipe(
          validateWith(SchoolContract),
          catchError((err) => throwError(() => new BadRequestException(err))),
        ),
    );

    return school;
  }

  async search(search: string) {
    const schools = await firstValueFrom<SchoolContract[]>(
      this.coreService.send(CORE_PATTERNS.SCHOOL.SEARCH, {
        searchTerm: search,
      }),
    );

    return schools;
  }
}
