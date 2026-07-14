import { Inject, Injectable } from '@nestjs/common';
import { SchoolService } from '../school/school.service';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import {
  CORE_PATTERNS,
  CORE_SERVICE,
  FindManyMemberResponse,
  SchoolUserContract,
  type FindBySchoolIdAndUserIdInput,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';
import { validateWith } from '../../utils/validate.operator';
import { mapCoreError } from '../../errors/core.error-maper';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MembershipService {
  constructor(
    private readonly schoolService: SchoolService,
    @Inject(CORE_SERVICE) private readonly coreService: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getSchool(schoolId: string) {
    return this.schoolService.findById(schoolId);
  }

  async findOne(schoolUserId: string) {
    const result = await firstValueFrom<SchoolUserContract>(
      this.coreService
        .send(CORE_PATTERNS.MEMBERSHIP.FIND_ONE, {
          id: schoolUserId,
        })
        .pipe(
          validateWith(SchoolUserContract),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );
    return result;
  }

  async findBySchoolIdAndUserId(input: FindBySchoolIdAndUserIdInput) {
    const cachedKey = `school_user:${input.userId}:${input.schoolId}`;
    const cached = await this.cacheManager.get<string>(cachedKey);
    if (cached) return JSON.parse(cached) as SchoolUserContract;
    const member = await firstValueFrom(
      this.coreService
        .send(CORE_PATTERNS.MEMBERSHIP.FIND_BY_SCHOOL_ID_AND_USER_ID, input)
        .pipe(
          timeout(3000),
          validateWith(SchoolUserContract),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );

    if (member)
      await this.cacheManager.set(cachedKey, JSON.stringify(member), 300);
    return member;
  }

  async findMany(schoolUserIds: string[]) {
    const result = await firstValueFrom<FindManyMemberResponse>(
      this.coreService
        .send(CORE_PATTERNS.MEMBERSHIP.FIND_MANY, { ids: schoolUserIds })
        .pipe(validateWith(FindManyMemberResponse)),
    );

    return result.members;
  }

  async findManyByUserId(userId: string) {
    const result = await firstValueFrom<FindManyMemberResponse>(
      this.coreService
        .send(CORE_PATTERNS.MEMBERSHIP.FIND_MANY_BY_USER_ID, {
          userIds: [userId],
        })
        .pipe(
          validateWith(FindManyMemberResponse),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );
    console.log('Result', result);

    return result.members;
  }
}
