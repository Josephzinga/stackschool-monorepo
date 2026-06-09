import { Account, User } from '@stackschool/db';
type UserWithAccounts = Partial<User> & {
    Account?: Partial<Account>[];
};
export interface UserAccountAnalysis {
    hasLocalPassword: boolean;
    socialProviders: string[];
    isSocialOnly: boolean;
}
export declare function analyzeUserAccounts(user: UserWithAccounts): UserAccountAnalysis;
export {};
//# sourceMappingURL=account-analysis.util.d.ts.map