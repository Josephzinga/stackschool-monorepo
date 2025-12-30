import { VerifyCallback } from 'passport-google-oauth20';
import {
  upsertOauthUser,
  UpsertOauthUserParams,
} from '../services/auth-user.service';

/**
 * Gère les stratégies d'authentification OAuth (Google, Facebook, etc.) pour Passport.
 *
 * Cette fonction extrait les informations normalisées du profil utilisateur fourni par le fournisseur OAuth
 * et délègue la création ou la mise à jour de l'utilisateur au service `upsertOauthUser`.
 *
 * @param {string} accessToken - Le jeton d'accès fourni par le fournisseur OAuth.
 * @param {string} refreshToken - Le jeton de rafraîchissement (si disponible).
 * @param {any} profile - Le profil utilisateur brut retourné par le fournisseur.
 * @param {VerifyCallback} done - Le callback de Passport pour signaler le succès ou l'échec.
 * @param {UpsertOauthUserParams['provider']} provider - Le nom du fournisseur (ex: 'google', 'facebook').
 * @returns {Promise<void>}
 */
export default async function handleOauthStrategy(
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback,
  provider: UpsertOauthUserParams['provider'],
): Promise<void> {
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
      accessToken,
      refreshToken,
    });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
