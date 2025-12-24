import { createUserSession } from '../services/session.service';
import { createJwtForUser } from '../services/create-jwt-for-user';

export async function createMobileSession(user: any) {
  const { refreshToken, expires } = await createUserSession(user.id);
  console.log('user session created');
  return {
    accessToken: createJwtForUser(user),
    refreshToken,
    expires,
  };
}
