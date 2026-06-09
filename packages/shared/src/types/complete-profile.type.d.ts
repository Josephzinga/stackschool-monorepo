import type { Account, Gender, Profile, School, User } from '@stackschool/db';
import { CreateSchoolType, ParentFormDataType, StaffFormDataType, StudentFormDataType, TeacherFormDataType } from '../validation/complete-profile.schema';
type CreateSchoolPayload = {
    type: 'create';
    newSchool: CreateSchoolType;
};
export type SchoolSelected = Pick<School, 'name' | 'id' | 'code' | 'address' | 'logo'>;
type JoinSchoolPayload = {
    type: 'join';
    schoolSelected: SchoolSelected;
};
type InviteSchoolPayload = {
    type: 'invite';
    schoolId: string;
};
export type SchoolData = CreateSchoolPayload | JoinSchoolPayload | InviteSchoolPayload;
export type RoleData = StudentData | ParentData | TeacherData | StaffData | AdminData;
type StudentData = {
    role: 'STUDENT';
    student: StudentFormDataType;
};
type ParentData = {
    role: 'PARENT';
    parent: ParentFormDataType;
};
type TeacherData = {
    role: 'TEACHER';
    teacher: TeacherFormDataType;
};
type StaffData = {
    role: 'STAFF';
    staff: StaffFormDataType;
};
type AdminData = {
    role: 'ADMIN';
    admin: StaffFormDataType;
};
export interface ProfileData {
    firstname: string;
    lastname: string;
    gender: Gender;
    address: string | undefined;
    photo?: string | undefined;
    email?: string | undefined;
    phoneNumber?: string | undefined;
}
export type UserInMe = User & {
    profile: Profile;
    Account: Account[];
};
export interface SchoolClass {
    id: string;
    name: string;
    level: string;
    _count: {
        students: number;
    };
}
export {};
//# sourceMappingURL=complete-profile.type.d.ts.map