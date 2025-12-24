import { Request, Response } from 'express';
import { createUserSession } from '../services/session.service';
import { createServiceError } from '../utils/api-response';

export async function handleSocialWebCallback(
  req: Request,
  res: Response,
  provider: string,
) {
  try {
    const baseUrl = process.env.FRONTEND_URL!;
    const user = req.user;

    if (!user || !user.id) {
      console.log('user not found');
      return res.redirect(`${baseUrl}/auth/login=error`);
    }

    const { refreshToken, expires } = await createUserSession(user.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires.getTime() - Date.now(),
    });

    if (!user.profileCompleted) {
      return res.redirect(`${baseUrl}/auth/complete-profile`);
    }

    return res.redirect(`${baseUrl}/dashboard`);
  } catch (error) {
    createServiceError(`Error get ${provider} callback: `, 500, error);
  }
}
