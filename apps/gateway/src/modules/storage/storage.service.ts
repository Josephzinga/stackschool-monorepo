import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fileTypeFromBuffer } from 'file-type';
import * as crypto from 'crypto';
import storageConfig from './storage.config';
import {
  StorageVisibility,
  UploadOptions,
  UploadResult,
} from './storage.types';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly baseUrl = process.env.API_URL!;
  constructor(
    @Inject(storageConfig.KEY) private config: ConfigType<typeof storageConfig>,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      forcePathStyle: this.config.forcePathStyle,
    });
  }

  async upload(
    file: Express.Multer.File,
    options: UploadOptions,
  ): Promise<UploadResult> {
    if (file.size > options.maxSizeBytes) {
      throw new BadRequestException(
        `Fichier trop volumineux (max ${options.maxSizeBytes / 1024 / 1024}MB).`,
      );
    }

    const detected = await fileTypeFromBuffer(file.buffer);
    if (!detected || !options.allowedMimeTypes.includes(detected.mime)) {
      throw new BadRequestException('Type de fichier non autorisé.');
    }

    const bucket = this.getBucketsName(options.visibility);
    const key = `${options.folder}/${options.ownerId}/${crypto.randomUUID()}.${detected.ext}`;

    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: detected.mime,
        Metadata: {
          ownerId: options.ownerId,
          originalName: file.originalname,
        },
      });

      await this.s3Client.send(command);

      return {
        key,
        url:
          options.visibility === 'public'
            ? `${this.config.publicUrl}/${bucket}/${key}`
            : '',
      };
    } catch (error: any) {
      console.log('Error', error);
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Erreur lors de l'upload: ${error?.message}`,
      );
    }
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.buckets.private,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async delete(key: string, visibility: StorageVisibility): Promise<void> {
    const bucket =
      visibility === 'public'
        ? this.config.buckets.public
        : this.config.buckets.private;
    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: key }),
    );
  }
  // Génération d'URL pour affichage sécurisé (proxy)
  getSecureUrl(fileName: string): string {
    // Cette URL sera proxifiée par le contrôleur
    const baseUrl = process.env.API_URL!;
    return `${baseUrl}/minio/proxy/${encodeURIComponent(fileName)}`;
  }
  getStaticUrl(key: string): string {
    const encodedKey = encodeURIComponent(key);
    return `${this.baseUrl}/minio/static/${encodedKey}`;
  }

  async getFile(key: string, visibility: StorageVisibility = 'public') {
    try {
      const command = new GetObjectCommand({
        Bucket: this.getBucketsName(visibility),
        Key: key,
      });
      return await this.s3Client.send(command);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Fichier non trouvé: ${error?.message}`);
    }
  }
  async checkFileAccess(
    key: string,
    userId: string,
    visibility: StorageVisibility,
  ): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.getBucketsName(visibility),
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const metadata = response.Metadata || {};

      // Si le fichier est public ou appartient à l'utilisateur
      return metadata.isPublic === 'true' || metadata.userId === userId;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false;
    }
  }
  async getFileInfo(key: string, visibility: StorageVisibility = 'public') {
    try {
      const command = new GetObjectCommand({
        Bucket: this.getBucketsName(visibility),
        Key: key,
      });

      const response = await this.s3Client.send(command);
      return {
        key,
        size: response.ContentLength,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        metadata: response.Metadata,
      };
    } catch (error: any) {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Erreur lors de la récupération des informations: ${error?.message}`,
      );
    }
  }

  async promoteTemp(
    tempKey: string,
    finalFolder: string,
    ownerId: string,
    visibility: StorageVisibility,
  ): Promise<UploadResult> {
    const bucket = this.getBucketsName(visibility);
    const ext = tempKey.split('.').pop();
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const finalKey = `${finalFolder}/${ownerId}/${timestamp}-${random}.${ext}`;

    await this.s3Client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${tempKey}`,
        Key: finalKey,
      }),
    );
    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: tempKey }),
    );

    return {
      key: finalKey,
      url:
        visibility === 'public'
          ? `${this.config.publicUrl}/${bucket}/${finalKey}`
          : '',
    };
  }

  private getBucketsName(visibility: StorageVisibility) {
    return visibility === 'public'
      ? this.config.buckets.public
      : this.config.buckets.private;
  }
}
