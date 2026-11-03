import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

type Identifiant =
  | { userId: string; schoolId: string; schoolUserId: never }
  | { userId: never; schoolId: never; schoolUserId: string };

export interface NotificationPayload {
  schoolId?: string;
  schoolUserId: string;
  userId?: string;
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
    if (!payload.userId) return;
    this.gateway.notifyUser(payload.userId, 'notification', payload);

    // Point d'extension pour plus tard : persistance en DB, push mobile, etc.
    // await this.persistNotification(payload);
  }

  sendEnrollmentCompleted(payload: NotificationPayload) {
    console.log('send completeProfile', payload);
    if (!payload.schoolId)
      throw new BadRequestException('School id must be provided');
    this.gateway.notifySchoolUser(
      payload.schoolUserId,
      payload?.schoolId,
      'ENROLLMENT_COMPLETED',
      payload.data,
    );
  }
  sendToSchool(schoolId: string, event: string, payload: unknown) {
    this.gateway.notifySchoolRoom(schoolId, event, payload);
  }
}
