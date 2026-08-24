import 'dotenv/config';
import {CanActivate, ExecutionContext, Injectable,} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {RpcException} from "@nestjs/microservices";

@Injectable()
export class GatewayGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const internalSecret = process.env.GATEWAY_INTERNAL_SECRET!;
    const ctx = GqlExecutionContext.create(context).getContext();
    const req = ctx.req || context.switchToHttp().getRequest();
    const gatewaySecret = req.headers['x-internal-gateway-secret'];
    if (!gatewaySecret) throw new RpcException('Token manquant');

    if (internalSecret !== gatewaySecret)
      throw new RpcException(
        "L'accès direct au service n'est pas autoriser.",
      );

    return true;
  }
}
