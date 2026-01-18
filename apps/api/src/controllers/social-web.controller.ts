import { NextFunction, Request, Response } from 'express';
import { createUserSession } from '../services/session.service';
import { createServiceError } from '../utils/api-errors';

/**
 * Gère le callback après une authentification sociale réussie pour l'application Web.
 *
 * Cette fonction est appelée après que Passport a validé l'utilisateur via OAuth.
 * Elle crée une session utilisateur, définit le cookie de rafraîchissement (refresh token)
 * et redirige l'utilisateur vers la page appropriée du frontend (dashboard ou complétion de profil).
 *
 * @param {Request} req - La requête Express contenant l'utilisateur authentifié (req.user).
 * @param {Response} res - La réponse Express pour gérer les cookies et la redirection.
 * @param {NextFunction} next - pour passer l'erreur à l'intercepteur d'erreur centrale
 * @param {string} provider - Le nom du fournisseur OAuth (pour les logs d'erreur).
 * @returns {Promise<void>}
 */
export async function handleSocialWebCallback(
  req: Request,
  res: Response,
  next: NextFunction,
  provider: string,
): Promise<void> {
  try {
    const baseUrl = process.env.FRONTEND_URL!;
    const user = req?.user;

    if (!user || !user?.id) {
      return res.redirect(`${baseUrl}/auth/login=error`);
    }

    const { refreshToken, expires } = await createUserSession(user.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires.getTime() - Date.now(),
    });

    if (!user?.profileCompleted) {
      return res.redirect(`${baseUrl}/auth/complete-profile`);
    }

    return res.redirect(`${baseUrl}/dashboard`);
  } catch (error) {
    next(createServiceError(`Error get ${provider} callback: `, 500, error));
  }
}
