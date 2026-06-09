type SchoolUserContext = {
    schoolId: string;
    userId: string;
};
type IsAdminArgs = {
    schoolUserId: string;
    context?: never;
} | {
    schoolUserId?: never;
    context: SchoolUserContext;
};
export declare const isAdmin: (args: IsAdminArgs) => Promise<{
    success: boolean;
    message?: string;
} | undefined>;
export {};
//# sourceMappingURL=verify-admin.d.ts.map