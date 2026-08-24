import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Response } from 'express';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CompleteProfileDataType,
  RoleDataType,
  SchoolDataType,
  SchoolRole,
} from '@stackschool/contracts';
import {
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CORE_PATTERNS,
  CORE_SERVICE,
  OPERATIONS_SERVICE,
  ProfileFormType,
  sendRmqRequest,
  UpdateProfileInput,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { mapAuthError } from '../../errors/auth.error-maper';
import { mapCoreError } from '../../errors/core.error-maper';
import {
  NotificationPayload,
  NotificationsService,
} from '../notifications/notifications.service';

@Injectable()
export class CompleteProfileService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(CORE_SERVICE) private readonly coreClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(OPERATIONS_SERVICE) private readonly operationsClient: ClientProxy,
    private readonly notificationsService: NotificationsService,
  ) {}

  async saveProgress(
    userId: string,
    dto: CompleteProfileDataType,
    res: Response,
  ) {
    const redisKey = `complete_profile:${userId}`;
    try {
      const existingDataStr = await this.cacheManager.get<string>(redisKey);
      const existingData: Partial<CompleteProfileDataType> = existingDataStr
        ? (JSON.parse(existingDataStr) as Partial<CompleteProfileDataType>)
        : {};

      const newData = {
        ...existingData,
        ...dto,
        savedAt: new Date().toISOString(),
        userId,
      };

      await this.cacheManager.set(
        redisKey,
        JSON.stringify(newData),
        1000 * 60 * 60 * 24, // 24h
      );

      return res.status(200).json({
        ok: true,
        message: 'Progression sauvegardée',
        savedAt: newData.savedAt,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Erreur lors de la sauvegarde',
        error,
      );
    }
  }

  async loadProgress(userId: string, res: Response) {
    const redisKey = `complete_profile:${userId}`;
    try {
      const saveData = await this.cacheManager.get<string>(redisKey);
      if (!saveData) {
        return res.status(400).json({
          ok: true,
          data: null,
          message: 'Aucune progression sauvegardée',
        });
      }

      const dataParsed = JSON.parse(saveData) as CompleteProfileDataType & {
        savedAt: Date;
      };

      const profileWithPhoto = { ...dataParsed.profile };

      return res.status(200).json({
        ok: true,
        data: {
          school: dataParsed.school,
          profile: profileWithPhoto,
          role: dataParsed.role,
          currentStep: dataParsed.currentStep,
          savedAt: dataParsed.savedAt,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Erreur lors du chargement',
        error,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} completeProfile`;
  }

  async confirm(userId: string) {
    const cachedKey = `complete_profile:${userId}`;

    const cachedData = await this.cacheManager.get<string>(cachedKey);
    if (!cachedData || cachedData === 'null' || cachedData === 'undefined') {
      throw new BadRequestException(
        'Aucune donnée de profil trouvée (Session expirée). Veuillez recommencer.',
      );
    }

    const { school, role, profile } = JSON.parse(cachedData) as {
      school: SchoolDataType;
      role: RoleDataType;
      profile: ProfileFormType;
    };
    const profileResult = await this.handleProfileUpdate({
      profileData: profile,
      userId,
    });
    console.log(profileResult);
    if (!profileResult?.ok)
      throw new InternalServerErrorException(
        'Erreur lors de la misse à jour de donnée utilisateur.',
      );

    const schoolResult = await this.createSchoolData(userId, school, role.role);
    console.log(schoolResult);
    if (!schoolResult?.ok)
      throw new InternalServerErrorException(
        "Erreur lors de la procédure de l'étape school",
      );
    const roleResult = await this.handleRoleCreation(
      userId,
      schoolResult.data.schoolId,
      role,
      school.type === 'create',
    );
    console.log('Role: ', roleResult);
    if (!roleResult?.ok)
      throw new InternalServerErrorException("Erreur de l'étape Rôle.");

    if (school.type === 'create') {
      const { ok } = await this.updateUserAfterProfileCompleted(userId);
      if (!ok)
        throw new InternalServerErrorException(
          'Erreur lors de la misse à jour de compte utilisateur.',
        );
    }
    const payload: NotificationPayload = {
      userId,
      schoolId: schoolResult.data?.schoolId,
      title: 'Confirmé',
      message: "Un utilisateur s'est inscriptions votre établissement.",
      type: 'ENROLLMENT_COMPLETED',
      data: roleResult,
    };

    this.notificationsService.sendEnrollmentCompleted(payload);

    await this.cacheManager.del(cachedKey);

    return {
      ok: true,
      message: 'Profil finalisé avec succès',
    };
  }

  private async createSchoolData(
    userId: string,
    schoolData: SchoolDataType,
    role: SchoolRole,
  ) {
    return sendRmqRequest<{
      ok: boolean;
      message: string;
      data: Record<string, string>;
    }>(
      this.coreClient,
      CORE_PATTERNS.COMPLETE_PROFILE.HANDLE_SCHOOL_DATA,
      { userId, schoolData, role },
      mapCoreError,
    );
  }

  private async handleProfileUpdate(data: UpdateProfileInput) {
    const result = await firstValueFrom<{
      ok: boolean;
      message: string;
      data: Record<string, string>;
    }>(
      this.authClient.send(AUTH_PATTERNS.UPDATE_USER_PROFILE, data).pipe(
        timeout(3000),
        catchError((err) => throwError(() => mapAuthError(err))),
      ),
    );

    return result;
  }

  private async handleRoleCreation(
    userId: string,
    schoolId: string,
    roleData: RoleDataType,
    isNewSchool: boolean = false,
  ) {
    const result = await firstValueFrom<{
      ok: boolean;
      message: string;
      data: Record<string, string | undefined | null>;
    }>(
      this.coreClient
        .send(CORE_PATTERNS.COMPLETE_PROFILE.HANDLE_ROLE_DATA, {
          userId,
          schoolId,
          roleData,
          isNewSchool,
        })
        .pipe(
          timeout(3000),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );
    return result;
  }

  private async updateUserAfterProfileCompleted(userId: string) {
    return await firstValueFrom<{ ok: boolean; message: string }>(
      this.authClient
        .send(AUTH_PATTERNS.UPDATE_USER_AFTER_PROFILE_COMPLETED, { userId })
        .pipe(
          timeout(3000),
          catchError((err) => throwError(() => mapCoreError(err))),
        ),
    );
  }
}
