import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
  getAuthenticateOptions() {
    return { scope: ['email', 'public_profile'], session: true };
  }

  async canActivate(context: ExecutionContext) {
    const result = await super.canActivate(context);
    const req = context.switchToHttp().getRequest<Request>();
    await super.logIn(req);
    return result as boolean;
  }
}
