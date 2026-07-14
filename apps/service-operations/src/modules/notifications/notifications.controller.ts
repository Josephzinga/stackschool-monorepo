import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  AUTH_EVENTS,
  SendWhatsAppCodeInput,
  SendEmailLinkInput,
} from '@stackschool/messaging';
import { NotificationsService } from './notifications.service';
import { ZodValidationPipe } from '../../utils/zod-validation-pipe';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(AUTH_EVENTS.SEND_WHATSAPP_CODE)
  async sendWhatsappCode(
    @Payload(new ZodValidationPipe(SendWhatsAppCodeInput))
    dto: SendWhatsAppCodeInput,
  ) {
    console.log('Service operations send whatsappCode', dto);
    return await this.notificationsService.sendWhatsAppCode(
      dto.phoneNumber,
      dto.code,
    );
  }

  @EventPattern(AUTH_EVENTS.SEND_EMAIL_LINK)
  async sendByEmail(
    @Payload(new ZodValidationPipe(SendEmailLinkInput)) dto: SendEmailLinkInput,
  ) {
    console.log('Send email link', dto);
    return this.notificationsService.sendResetPasswordEmail(dto);
  }
}
