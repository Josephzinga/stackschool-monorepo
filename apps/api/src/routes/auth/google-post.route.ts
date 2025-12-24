// routes/auth/google.post.ts (Express)
import { OAuth2Client } from 'google-auth-library';
import { UpsertOauthUser, upsertOauthUser } from '../../services/auth-social';
import { Router } from 'express';
import { sendApiResponse } from '../../middlewares/errorHandler';
import { createServiceError } from '../../utils/api-response';
import { createMobileSession } from '../../lib/mobile-session';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const router = Router();

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const idToken = req.body.idToken;
    if (!idToken) {
      return createServiceError('idToken manquant', 400);
    }

    console.log('idToken ', idToken);

    console.log('vérification');
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    console.log('verify');
    console.log('ticket', ticket);
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    const provider: UpsertOauthUser['provider'] = 'google';
    const providerAccountId = payload.sub!;
    const email = payload.email ?? null;
    const emailVerified = !!payload.email_verified;
    const displayName = payload.name ?? '';
    const picture = payload.picture ?? null;
    const givenName = payload.given_name ?? '';
    const familyName = payload.family_name ?? '';

    //helper user qui intéragit avec le base de donnée
    const user = await upsertOauthUser({
      provider,
      providerAccountId,
      email,
      emailVerified,
      displayName,
      firstname: givenName,
      lastname: familyName,
      avatar: picture,
      accessToken: undefined,
      refreshToken: undefined,
    });

    // création du JWT et session selon ta stratégie mobile
    const session = await createMobileSession(user);
    console.log('session', session);
    return sendApiResponse(res, 201, {
      ok: true,
      message: 'Authentification réusi avec succé',
      user,
      session,
    });
  } catch (err) {
    createServiceError('Google token verify failed', 500, err);
  }
});

export default router;
