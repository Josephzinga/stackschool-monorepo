import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { DoneCallback } from 'passport';
import { config } from 'dotenv';

config();

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL ?? '',
      enableProof: true,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: DoneCallback,
  ): Promise<any> {
    return this.authService.validateOAuthUser({
      accessToken,
      refreshToken,
      profileOAuth: {
        provider: 'facebook',
        profile,
      },
      done,
    });
  }
}
