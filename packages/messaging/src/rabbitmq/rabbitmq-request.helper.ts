import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { HttpException } from '@nestjs/common';
import { ServiceRpcException } from '../errors/service-rpc.error';

export async function sendRmqRequest<T>(
  client: ClientProxy,
  pattern: string,
  payload: unknown,
  mapError?: (payload: any) => HttpException | RpcException,
  timeoutMs = 3000,
): Promise<T> {
  return firstValueFrom(
    client.send<T>(pattern, payload).pipe(
      timeout(timeoutMs),
      catchError((err) =>
        throwError(() =>
          mapError
            ? mapError(err)
            : new ServiceRpcException('VALIDATION_ERROR', err),
        ),
      ),
    ),
  );
}
