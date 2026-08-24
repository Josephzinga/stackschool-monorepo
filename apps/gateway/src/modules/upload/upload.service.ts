import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Express } from 'express';
import { ACCEPTED_IMAGE_TYPES, ProfileContract } from '@stackschool/contracts';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { StorageService } from '../storage/storage.service';
import { AUTH_PATTERNS, AUTH_SERVICE } from '@stackschool/messaging';
import { mapAuthError } from '../../errors/auth.error-maper';
import { randomUUID } from 'crypto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UploadService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly storage: StorageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  async uploadAvatar(file: Express.Multer.File, userId: string) {
    const result = await this.storage.upload(file, {
      visibility: 'public',
      folder: 'avatars',
      ownerId: userId,
      allowedMimeTypes: ACCEPTED_IMAGE_TYPES,
      maxSizeBytes: 5 * 1024 * 1024,
    });

    const updateResult = await firstValueFrom<ProfileContract>(
      this.authClient
        .send(AUTH_PATTERNS.UPDATE_AVATAR, {
          userId: userId,
          avatarUrl: result.url,
        })
        .pipe(catchError((err) => throwError(() => mapAuthError(err)))),
    );
    return {
      success: true,
      message: 'Photo de profile mise à jour avec succès.',
      avatarUrl: updateResult.avatarUrl,
      userId: updateResult.userId,
    };
  }

  async uploadAvatarTemp(file: Express.Multer.File, userId: string) {
    try {
      const result = await this.storage.upload(file, {
        visibility: 'public', // ou 'private' selon le type final visé
        folder: 'tmp',
        ownerId: userId,
        allowedMimeTypes: ACCEPTED_IMAGE_TYPES,
        maxSizeBytes: 5 * 1024 * 1024,
      });
      const tempId = randomUUID();
      const ttlSeconds = 30 * 60; // 30 min

      await this.cacheManager.set(
        `temp_upload:${tempId}`,
        JSON.stringify({
          key: result.key,
          userId: userId,
          mimeType: file.mimetype,
        }),
        ttlSeconds,
      );

      return {
        tempId,
        url: result.url, // preview direct, pas besoin de repasser par Redis pour l'affichage
        expiresIn: ttlSeconds,
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        "Erreur d'enregistrement du fichier.",
        err,
      );
    }
  }
  async confirmAvatarUpload(tempId: string, userId: string): Promise<string> {
    const raw = await this.cacheManager.get<string>(`temp_upload:${tempId}`);
    if (!raw)
      throw new BadRequestException('Upload temporaire expiré ou introuvable.');

    const temp = JSON.parse(raw) as { userId: string; key: string };
    if (temp.userId !== userId) {
      throw new ForbiddenException('Ce fichier ne vous appartient pas.');
    }

    const result = await this.storage.promoteTemp(
      temp.key,
      'avatars',
      userId,
      'public',
    );
    await this.cacheManager.del(`temp_upload:${tempId}`);
    return result.url;
  }
}
