import 'dotenv/config';
import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { GraphQLDataSourceProcessOptions } from '@apollo/gateway';
import { GraphQLContext } from './context';

export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({
    request,
    context,
  }: GraphQLDataSourceProcessOptions<GraphQLContext>) {
    request?.http?.headers.set(
      'x-internal-gateway-secret',
      process.env.GATEWAY_INTERNAL_SECRET!,
    );

    if (context.user) {
      request.http?.headers.set('x-user-id', context.user.id);
      request.http?.headers.set('x-user-role', context?.user?.role);
    }
    if (context.schoolUser) {
      request.http?.headers.set('x-school-id', context.schoolId);
      request.http?.headers.set('x-school-role', context.schoolUser.role);
    }
  }
}
