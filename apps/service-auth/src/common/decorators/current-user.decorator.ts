import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserOptions {
  /** true = endpoint public mais pouvant être authentifié (user peut être undefined). */
  optional?: boolean;
}

const getContext = (context: ExecutionContext) => {

}
export const CurrentUser = createParamDecorator(
  (data: CurrentUserOptions | undefined, ctx: ExecutionContext) => {},
);
