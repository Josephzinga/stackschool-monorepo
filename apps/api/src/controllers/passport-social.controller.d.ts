import { VerifyCallback } from 'passport-google-oauth20';
import { UpsertOauthUserParams } from '../services/auth-user.service';
export default function handleOauthStrategy(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback, provider: UpsertOauthUserParams['provider']): Promise<void>;
//# sourceMappingURL=passport-social.controller.d.ts.map