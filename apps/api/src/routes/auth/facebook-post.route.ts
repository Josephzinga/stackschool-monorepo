import { Router } from 'express';
import { createServiceError } from '../../utils/api-response';
import { verifyFacebookToken } from '../../services/verifiy-token-facebook';
import { upsertOauthUser } from '../../services/auth-social';
import { createMobileSession } from '../../lib/mobile-session';
import { sendApiResponse } from '../../middlewares/errorHandler';

const router = Router();

router.post('/facebook', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return createServiceError('Access Token missing', 400);
    console.log('Access Token ', accessToken);

    const profile = await verifyFacebookToken(accessToken);

    console.log('profile', profile);
    const user = upsertOauthUser({
      provider: 'facebook',
      providerAccountId: profile.id,
      email: profile.email ?? null,
      emailVerified: !!profile.email,
      displayName: profile.name,
      firstname: profile.first_name ?? '',
      lastname: profile.last_name ?? '',
      avatar: profile.avatar ?? null,
      accessToken,
    });

    const session = await createMobileSession(user);

    return sendApiResponse(res, 201, {
      ok: true,
      user,
      session,
      message: 'Authentification réusi avec succé',
    });
  } catch (err) {
    console.log('Erreur authentification', err);
    createServiceError('Erreur authentification', 401, err);
  }
});
export default router;
