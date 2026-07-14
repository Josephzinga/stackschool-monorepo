import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Response } from 'express';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CompleteProfileDataType } from '@stackschool/contracts';

@Injectable()
export class CompleteProfileService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
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
        60 * 60 * 24, // 24h
      );

      return res.status(200).json({
        ok: true,
        message: 'Progression sauvegardée',
        savedAt: newData.savedAt,
      });
    } catch (error: any) {
      throw new InternalServerErrorException('Erreur lors de la sauvegarde');
    }
  }

  async loadProgress(userId: string, res: Response) {
    const redisKey = `complete_profile:${userId}`;
    const pathKey = `pendingPhoto${userId}`;
    try {
      const saveData = await this.cacheManager.get<string>(redisKey);
      const picturePath = await this.cacheManager.get<string>(pathKey);
      console.log('profilePath', picturePath);
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

      const profileWithPhoto = { ...dataParsed.profile, photo: picturePath };

      console.log('ProfilePhoto', profileWithPhoto.photo);

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

  remove(id: number) {
    return `This action removes a #${id} completeProfile`;
  }
}
