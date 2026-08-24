import {
  Controller,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ClientProxy } from '@nestjs/microservices';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ACCEPTED_IMAGE_TYPES } from '@stackschool/contracts';
import { StorageService } from '../storage/storage.service';
import { Request } from 'express';

@Controller('api/upload')
@UseGuards(AuthenticatedGuard)
export class UploadController {
  constructor(
    private uploadService: UploadService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly storage: StorageService,
  ) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile()
    file: Express.Multer.File,
    @CurrentUser() user: NonNullable<Request['user']>,
  ) {
    return await this.uploadService.uploadAvatar(file, user.id);
  }

  @Post('temp')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemp(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: NonNullable<Request['user']>,
  ) {
    const result = await this.uploadService.uploadAvatarTemp(file, user.id);
    return {
      ok: true,
      message: 'Image enregistré temporairement avec succès.',
      ...result,
    };
  }

  @UseGuards(new AuthenticatedGuard())
  @Post('student-photo/:studentId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudentPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('studentId') studentId: string,
  ) {
    const result = await this.storage.upload(file, {
      visibility: 'private', // photos d'élèves = accès restreint
      folder: 'students',
      ownerId: studentId,
      allowedMimeTypes: ACCEPTED_IMAGE_TYPES,
      maxSizeBytes: 3 * 1024 * 1024,
    });
    /*
    await this.academicClient.send(ACADEMIC_PATTERNS.UPDATE_STUDENT_PHOTO, {
      studentId,
      photoKey: result.key,
    });*/
    return { key: result.key }; // pas d'URL directe puisque privé
  }
}
