import { Router } from 'express';
import { createServiceError } from '../../utils/api-errors';
import { verifyFacebookToken } from '../../services/facebook-token.service';
import { upsertOauthUser } from '../../services/auth-user.service';
import { createMobileSession } from '../../lib/mobile-session';
import { sendApiResponse } from '../../middlewares/errorHandler';

const router = Router();

router.post('/facebook', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return createServiceError('Access Token missing', 400);
    }
    const profile = await verifyFacebookToken(accessToken);

    const user = await upsertOauthUser({
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
      message: 'Authentification réussie avec succès',
    });
  } catch (err) {
    throw createServiceError('Erreur authentification', 401, err);
  }
});
export default router;
