interface UsernameOptions {
    separator?: string;
    maxLength?: number;
    includeNumbers?: boolean;
    lowercase?: boolean;
    ignoredChars?: string[];
}
export declare function generateUsername(firstname: string, lastname: string, options?: UsernameOptions): string;
export declare function generateUsernameVariants(firstname: string, lastname: string, count?: number): string[];
export {};
//# sourceMappingURL=generate-username.d.ts.map