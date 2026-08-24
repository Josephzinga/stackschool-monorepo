import {Request} from 'express';
import {UserWithRelationsContract} from "@stackschool/contracts";


type RequestWithUser = Request & {user: UserWithRelationsContract}

/*function getRequest(context: ExecutionContext) {
  if (context.getType<GqlContextType>() === 'graphql') {
    const gqlCtx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    // Ton createContext() renvoie { req, ... } → on récupère le même req Express.
    return gqlCtx.req ?? gqlCtx;
  }
  return context.switchToHttp().getRequest<Request>();
}

export interface CurrentUserOptions {
optional?: boolean;
}

export const CurrentUser = createParamDecorator(
    (data: CurrentUserOptions | undefined, ctx: ExecutionContext) => {
        const user = getRequest(ctx).user as UserWithRelationsContract

        // Filet de sécurité : sur une route protégée, le guard a dû passer avant.
        // Si on arrive ici sans user, c'est une erreur de câblage (guard oublié).
        if (!user && !data?.optional) {
            throw new InternalServerErrorException(
                'CurrentUser utilisé sans guard : ajoute @UseGuards(AuthenticatedGuard).',
            );
        }

        return user;
    },
);
*/
