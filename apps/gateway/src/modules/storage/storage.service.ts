import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fileTypeFromBuffer } from 'file-type';
import { randomUUID } from 'crypto';
import storageConfig from './storage.config';
import {
  StorageVisibility,
  UploadOptions,
  UploadResult,
} from './storage.types';
import type { Express } from 'express';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  constructor(
    @Inject(storageConfig.KEY) private config: ConfigType<typeof storageConfig>,
  ) {
    this.s3 = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      forcePathStyle: true,
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

    const bucket =
      options.visibility === 'public'
        ? this.config.buckets.public
        : this.config.buckets.private;
    const key = `${options.folder}/${options.ownerId}/${randomUUID()}.${detected.ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: detected.mime,
      }),
    );
    return {
      key,
      url:
        options.visibility === 'public'
          ? `${this.config.publicUrl}/${bucket}/${key}`
          : '',
    };
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.buckets.private,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }

  async delete(key: string, visibility: 'public' | 'private'): Promise<void> {
    const bucket =
      visibility === 'public'
        ? this.config.buckets.public
        : this.config.buckets.private;
    await this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  }

  async promoteTemp(
    tempKey: string,
    finalFolder: string,
    ownerId: string,
    visibility: StorageVisibility,
  ): Promise<UploadResult> {
    const bucket =
      visibility === 'public'
        ? this.config.buckets.public
        : this.config.buckets.private;
    const ext = tempKey.split('.').pop();
    const finalKey = `${finalFolder}/${ownerId}/${randomUUID()}.${ext}`;

    await this.s3.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${tempKey}`,
        Key: finalKey,
      }),
    );
    await this.s3.send(
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
}
