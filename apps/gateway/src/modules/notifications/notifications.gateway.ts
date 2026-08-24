import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { SessionSocketAuthService } from './session-socket-auth.service';
import { MembershipService } from '../membership/membership.service';

@Injectable()
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: '/notifications',
  transports: ['websocket'],
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger(NotificationsGateway.name);

  constructor(
    private sessionAuth: SessionSocketAuthService,
    private readonly memberService: MembershipService,
  ) {}

  async handleConnection(client: Socket) {
    const user = await this.sessionAuth.authenticate(client);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data.userId = user.id;
    client.join(`user:${user.id}`);
    const schoolUsers = await this.memberService.findManyByUserId(user.id);
    for (const su of schoolUsers) {
      client.join(`schoolUser:${su.schoolId}:${user.id}`);
      client.join(`school:${su.schoolId}`);
    }

    this.logger.log(
      `Connecté: user=${user.id}, écoles=[${schoolUsers.map((s) => s.schoolId).join(', ')}]`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Déconnecté: ${client.data.userId}`);
  }

  notifyUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  notifySchoolUser(
    schoolId: string,
    userId: string,
    event: string,
    payload: unknown,
  ) {
    this.server.to(`schoolUser:${schoolId}:${userId}`).emit(event, payload);
  }

  notifySchoolRoom(schoolId: string, event: string, payload: unknown) {
    this.server.to(`school:${schoolId}`).emit(event, payload);
  }
}
