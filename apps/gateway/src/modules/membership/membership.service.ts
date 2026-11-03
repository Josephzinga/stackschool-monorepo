import { Inject, Injectable } from '@nestjs/common';
import { SchoolService } from '../school/school.service';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import {
  CORE_PATTERNS,
  CORE_SERVICE,
  type FindBySchoolIdAndUserIdInput,
  FindManyMemberResponse,
} from '@stackschool/messaging';

import { SchoolUserContract } from '@stackschool/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { validateWith } from '../../utils/validate.operator';
import { mapCoreError } from '../../errors/core.error-maper';

@Injectable()
export class MembershipService {
  constructor(
    private readonly schoolService: SchoolService,
    @Inject(CORE_SERVICE) private readonly coreClient: ClientProxy,
  ) {}

  async getSchool(schoolId: string) {
    return this.schoolService.findById(schoolId);
  }

  async findOne(schoolUserId: string) {
    const result = await firstValueFrom<SchoolUserContract | null>(
      this.coreClient
        .send(CORE_PATTERNS.MEMBERSHIP.FIND_ONE, {
          id: schoolUserId,
        })
        .pipe(
          timeout(3000),
          validateWith(SchoolUserContract.nullable()),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );
    return result;
  }

  async findBySchoolIdAndUserId(input: FindBySchoolIdAndUserIdInput) {
    return await firstValueFrom(
      this.coreClient
        .send(CORE_PATTERNS.MEMBERSHIP.FIND_BY_SCHOOL_ID_AND_USER_ID, input)
        .pipe(
          timeout(3000),
          validateWith(SchoolUserContract.optional()),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );
  }

  async findMany(schoolUserIds: string[]) {
    const result = await firstValueFrom<FindManyMemberResponse>(
      this.coreClient
        .send(CORE_PATTERNS.MEMBERSHIP.FIND_MANY, { ids: schoolUserIds })
        .pipe(
          timeout(3000),
          validateWith(FindManyMemberResponse),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );

    return result.members;
  }

  async findManyByUserId(userId: string) {
    console.log('Membership findManyByUserId: ', userId);
    const result = await firstValueFrom<FindManyMemberResponse>(
      this.coreClient
        .send(CORE_PATTERNS.MEMBERSHIP.FIND_MANY_BY_USER_ID, {
          userIds: [userId],
        })
        .pipe(
          timeout(3000),
          validateWith(FindManyMemberResponse),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );

    return result.members;
  }
}
