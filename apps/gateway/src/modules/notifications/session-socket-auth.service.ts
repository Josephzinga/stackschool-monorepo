import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import * as signature from 'cookie-signature';
import { SESSION_STORE } from '../session/session-store.provider';
import { PGStore } from 'connect-pg-simple';

@Injectable()
export class SessionSocketAuthService {
  constructor(@Inject(SESSION_STORE) private sessionStore: PGStore) {}

  async authenticate(client: Socket): Promise<{ id: string } | null> {
    const rawCookie = client.handshake.headers.cookie;
    if (!rawCookie) return null;

    const parsed = cookie.parseCookie(rawCookie);

    const sessionCookie = parsed['sid'];
    if (!sessionCookie) return null;

    const sessionId = signature.unsign(
      sessionCookie.slice(2),
      process.env.SESSION_SECRET!,
    );
    if (!sessionId) return null;

    const session = await this.getSession(sessionId);
    if (!session?.passport?.user) return null;

    return { id: session.passport.user };
  }

  private getSession(sessionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sessionStore.get(sessionId, (err: any, session: any) => {
        if (err) return reject(err);
        return resolve(session);
      });
    });
  }
}
