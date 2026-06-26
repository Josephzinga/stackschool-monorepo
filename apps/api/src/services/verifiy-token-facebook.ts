import { api } from '@stackschool/shared';
import crypto from 'crypto';
import { createServiceError } from '../utils/api-response';

const FACEBOOk_APP_SECRET = process.env.FACEBOOK_CLIENT_SECRET!;

export async function verifyFacebookToken(accessToken: string) {
  const appsecret_proof = crypto
    .createHmac('sha256', FACEBOOk_APP_SECRET)
    .update(accessToken)
    .digest('hex');
  const field = 'id,name,email,first_name,last_name,picture';
  const url = `https://graph.facebook.com/me?fields=${field}&access_token=${accessToken}&appsecret_proof=${appsecret_proof}`;

  const res = await api.post(url);
  console.log('reponse de facebook', res.data);

  if (!res.data.ok) {
    createServiceError('Invalid Facebook token');
  }

  return res.data;
}
