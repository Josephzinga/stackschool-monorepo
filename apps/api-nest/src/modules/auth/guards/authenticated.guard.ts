import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.isAuthenticated?.() || !request.user) {
      throw new UnauthorizedException(
        'Utilisateur non authentifier veuillez vous connecter.',
      );
    }
    return request.isAuthenticated?.() === true;
  }
}
