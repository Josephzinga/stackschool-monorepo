import { VerifyCallback, Profile } from 'passport-google-oauth20';

import { UpsertOauthUser, upsertOauthUser } from '../services/auth-social';
import { createUserSession } from '../services/session.service';

export default async function handleOauthCallback(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
  provider: UpsertOauthUser['provider'],
) {
  try {
    const providerAccountId = profile?.id;
    const emailRaw = profile?.emails?.[0]?.value || null;
    const emailVerified = profile.emails?.[0].verified ?? false;
    const email = emailRaw ? emailRaw.toLocaleLowerCase() : '';
    const displayName = profile?.displayName ?? '';
    const avatar = profile?.photos?.[0]?.value || null;

    const parts = displayName.trim() ? displayName.trim().split(/\s+/) : [];
    const firstname = parts.shift() ?? '';
    const lastname = parts.join(' ') ?? '';

    const user = await upsertOauthUser({
      provider,
      email,
      displayName,
      avatar,
      firstname,
      lastname,
      providerAccountId,
      emailVerified,
    });

    await createUserSession(user.id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
