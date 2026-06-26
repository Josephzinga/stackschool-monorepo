import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import { Profile, User, prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { generateToken } from '../../lib/outils';
import { UserInMe } from '@stackschool/shared';

const router = Router();

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
type UserWithProfile = User & {
  profile: Profile;
};

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: UserInMe, info: any) => {
    try {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      }

      if (info) {
        if (info?.isSocialOnly) {
          const providers = Array.isArray(info.providers)
            ? info.providers.join(',')
            : info.providers || '';

          return res.status(403).json({
            ok: false,
            isSocialOnly: true,
            providers,
            message: 'Compte social uniquement — complétez votre profil.',
          });
        }
        return next(createServiceError(info.message, 401));
      }
      if (!user) {
        const msg = info?.message || 'Identifiants invalides';
        return next(createServiceError(msg, 401));
      }

      req.login(user, async (loginErr: any) => {
        if (loginErr) {
          return next(
            createServiceError('La connexion a échoué', 500, loginErr),
          );
        }

        const refreshToken = generateToken(32);
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);

        await prisma.session.create({
          data: {
            sessionToken: refreshToken,
            userId: user.id,
            expires,
          },
        });

        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 25,
        });

        return res.json({
          ok: true,
          message: 'Authentification reussi avec succès!',
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            phoneNumber: user.phoneNumber,
            profileCompleted: user.profileCompleted,
            provider: user.Account.map((acc) => acc.provider).join(','),
          },
        });
      });
      console.log('user', user);
    } catch (error: any) {
      console.error('Error in local login callback:', error);
      return next(error);
    }
  })(req, res, next);
});
export default router;
