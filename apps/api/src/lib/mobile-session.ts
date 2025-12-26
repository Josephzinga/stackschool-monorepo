import { createUserSession } from '../services/session.service';
import { createJwtForUser } from '../services/create-jwt-for-user';

export async function createMobileSession(user: any) {
  const { refreshToken, expires } = await createUserSession(user.userId);
  console.log('user MobileSession', user.id, user.userId);
  console.log('refreshToken', refreshToken);
  console.log('expires', expires);
  return {
    accessToken: createJwtForUser(user),
    refreshToken,
    expires,
  };
}
