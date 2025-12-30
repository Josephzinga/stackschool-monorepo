import { prisma, Session } from '@stackschool/db';
import { SESSION_EXPIRES_DAY } from '../constant/config';
import { generateToken } from '../lib/outils';

/**
 * Crée une nouvelle session utilisateur en base de données.
 *
 * Génère un jeton de rafraîchissement (refresh token) et définit sa date d'expiration.
 *
 * @param {string} userId - L'identifiant de l'utilisateur pour qui créer la session.
 * @returns {Promise<{refreshToken: string, expires: Date, session: Session}>} Les détails de la session créée.
 */
export async function createUserSession(
  userId: string,
): Promise<{ refreshToken: string; expires: Date; session: Session }> {
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
