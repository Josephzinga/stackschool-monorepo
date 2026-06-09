import { SchoolRole } from '@stackschool/db';
import { UserInMe } from '@stackschool/shared';
type SchoolUserContext = {
    schoolId: string;
    userId: string;
};
type CheckRoleArgs = {
    schoolUserId: string;
    context?: never;
    roles: SchoolRole[];
} | {
    schoolUserId?: never;
    context: SchoolUserContext;
    roles: SchoolRole[];
};
export declare const checkRole: (args: CheckRoleArgs) => Promise<{
    success: boolean;
    message?: string;
    member?: any;
}>;
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
}>;
export declare function checkUser(user?: UserInMe | null): asserts user is UserInMe;
export declare function checkSchoolId(schoolId: string | null | undefined): asserts schoolId is string;
export {};
//# sourceMappingURL=verify-role.d.ts.map