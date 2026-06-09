export interface UpsertOauthUserParams {
    provider: 'google' | 'facebook';
    providerAccountId: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string;
    firstname?: string;
    lastname?: string;
    avatar: string | null;
    accessToken?: string;
    refreshToken?: string;
}
export declare function upsertOauthUser({ provider, providerAccountId, email, emailVerified, displayName, firstname, lastname, avatar, accessToken, refreshToken, }: UpsertOauthUserParams): Promise<any>;
//# sourceMappingURL=auth-user.service.d.ts.map