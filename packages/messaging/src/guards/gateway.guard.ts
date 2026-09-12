import 'dotenv/config';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RpcException } from '@nestjs/microservices';
import { ServiceRpcException } from '../errors';

@Injectable()
export class GatewayGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const internalSecret = process.env.GATEWAY_INTERNAL_SECRET!;
    const ctx = GqlExecutionContext.create(context).getContext();
    const req = ctx.req || context.switchToHttp().getRequest();
    const gatewaySecret = req.headers['x-internal-gateway-secret'];
    if (!gatewaySecret) throw new RpcException('Token manquant');

    if (internalSecret !== gatewaySecret)
      throw new ServiceRpcException(
        'FORBIDDEN',
        "L'accès direct au service n'est pas autorisé.",
      );

    return true;
  }
}
