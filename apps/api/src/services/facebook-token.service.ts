import { api } from '@stackschool/shared';
import crypto from 'crypto';
import { createServiceError } from '../utils/api-errors';

const FACEBOOK_APP_SECRET = process.env.FACEBOOK_CLIENT_SECRET!;

/**
 * Vérifie la validité d'un jeton d'accès Facebook en appelant l'API Graph de Facebook.
 *
 * Utilise `appsecret_proof` pour sécuriser l'appel API côté serveur.
 *
 * @param {string} accessToken - Le jeton d'accès Facebook à vérifier.
 * @returns {Promise<any>} Les données du profil utilisateur Facebook si le jeton est valide.
 * @throws {ServiceError} Si le jeton est invalide ou si l'appel API échoue.
 */
export async function verifyFacebookToken(accessToken: string): Promise<any> {
  const appsecret_proof = crypto
    .createHmac('sha256', FACEBOOK_APP_SECRET)
    .update(accessToken)
    .digest('hex');
  const field = 'id,name,email,first_name,last_name,picture';
  const url = `https://graph.facebook.com/me?fields=${field}&access_token=${accessToken}&appsecret_proof=${appsecret_proof}`;

  try {
    const res = await api.post(url);
    console.log('reponse de facebook', res.data);

    // Note: L'API Graph Facebook retourne généralement les données directement ou une erreur JSON,
    // pas forcément une propriété `ok`. Il faudrait vérifier res.status ou res.data.error.
    // Je garde la logique existante pour l'instant mais c'est un point à vérifier.
    if (!res.data || res.data.error) {
      throw createServiceError('Invalid Facebook token');
    }

    return res.data;
  } catch (error) {
    throw createServiceError('Invalid Facebook token', 401, error);
  }
}
