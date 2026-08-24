import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

export interface NotificationPayload {
  userId: string;
  schoolId?: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  constructor(private gateway: NotificationsGateway) {}

  send(payload: NotificationPayload) {
    // Emission temps réel si connecté
    this.gateway.notifyUser(payload.userId, 'notification', payload);

    // Point d'extension pour plus tard : persistance en DB, push mobile, etc.
    // await this.persistNotification(payload);
  }

  sendEnrollmentCompleted(payload: NotificationPayload) {
    console.log('send completeProfile', payload);
    if (!payload.schoolId)
      throw new BadRequestException('School Id must be provided');
    this.gateway.notifySchoolUser(
      payload.userId,
      payload?.schoolId,
      'ENROLLMENT_COMPLETED',
      payload.data,
    );
  }
  sendToSchool(schoolId: string, event: string, payload: unknown) {
    this.gateway.notifySchoolRoom(schoolId, event, payload);
  }
}
