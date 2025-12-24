import { prisma } from '@stackschool/db';
import { SESSION_EXPIRES_DAY } from '../constant/config';
import { generateToken } from '../lib/outils';

export async function createUserSession(userId: string) {
  const refreshToken = generateToken(16);
  const expires = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRES_DAY,
  );

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken: refreshToken,
      expires,
    },
  });

  return { refreshToken, expires, session };
}
