export declare function saveSession(session: {
    accessToken: string;
    refreshToken: string;
    expires: string;
}): Promise<void>;
export declare function getAccessToken(): Promise<string | null>;
export declare function getRefreshToken(): Promise<string | null>;
export declare function clearSession(): Promise<void>;
export declare function isAccessTokenExpired(): Promise<boolean>;
//# sourceMappingURL=token-storage.d.ts.map