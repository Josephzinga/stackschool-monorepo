import { Session } from '@stackschool/db';
export declare function createUserSession(userId: string): Promise<{
    refreshToken: string;
    expires: Date;
    session: Session;
}>;
//# sourceMappingURL=session.service.d.ts.map