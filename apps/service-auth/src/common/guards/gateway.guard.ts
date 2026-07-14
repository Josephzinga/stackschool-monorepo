import 'dotenv/config';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

@Injectable()
export class GatewayGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const internalSecret = process.env.GATEWAY_INTERNAL_SECRET!;
    console.log('internalSecret', internalSecret);
    const ctx = GqlExecutionContext.create(context).getContext();
    const req = ctx.req || context.switchToHttp().getRequest();
    const gatewaySecret = req.headers['x-internal-gateway-secret'];
    if (!gatewaySecret) throw new BadRequestException('Token manquant');

    if (internalSecret !== gatewaySecret)
      throw new UnauthorizedException(
        "L'accès direct au service n'est pas autoriser.",
      );

    return true;
  }
}
