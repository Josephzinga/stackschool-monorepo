import { SchoolRole } from '@stackschool/db';
interface CreateInvitationParams {
    schoolId: string;
    role: SchoolRole;
    email?: string | null;
    phoneNumber?: string | null;
    message?: string | null;
}
export declare function createAndSendInvitation(params: CreateInvitationParams): Promise<{
    id: string;
    createdAt: Date;
    schoolId: string;
    code: string | null;
    email: string | null;
    phoneNumber: string | null;
    role: import("@stackschool/db").$Enums.SchoolRole;
    studentId: string | null;
    message: string;
    token: string | null;
    relation: string | null;
    expiresAt: Date;
    used: boolean;
}>;
export {};
//# sourceMappingURL=invitation.service.d.ts.map