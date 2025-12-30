import { createUserSession } from '../services/session.service';
import { createJwtForUser } from '../services/jwt.service';

export async function createMobileSession(user: any) {
  const { refreshToken, expires } = await createUserSession(user.userId);
  return {
    accessToken: createJwtForUser(user),
    refreshToken,
    expires,
  };
}
