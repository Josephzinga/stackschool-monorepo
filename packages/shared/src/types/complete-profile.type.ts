import type { Account, Gender, Profile, School, User } from '@stackschool/db';
import {
  CreateSchoolType,
  ParentFormData,
  StaffFormValues,
  StudentFormData,
  TeacherFormData,
} from '../validation/complete-profile.schema';

type CreateSchoolPayload = {
  type: 'create';
  newSchool: CreateSchoolType;
};
export type SchoolSelected = Pick<
  School,
  'name' | 'id' | 'code' | 'address' | 'logo'
>;
type JoinSchoolPayload = {
  type: 'join';
  schoolSelected: SchoolSelected;
};

type InviteSchoolPayload = {
  type: 'invite';
  schoolId: string;
};
export type SchoolData =
  | CreateSchoolPayload
  | JoinSchoolPayload
  | InviteSchoolPayload;

export type RoleData =
  | StudentData
  | ParentData
  | TeacherData
  | StaffData
  | AdminData;

type StudentData = {
  role: 'STUDENT';
  student: StudentFormData;
};

type ParentData = {
  role: 'PARENT';
  parent: ParentFormData;
};

type TeacherData = {
  role: 'TEACHER';
  teacher: TeacherFormData;
};

type StaffData = {
  role: 'STAFF';
  staff: StaffFormValues;
};

type AdminData = {
  role: 'ADMIN';
  admin: StaffFormValues;
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
type Moi = UserInMe['id'];
export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  _count: { students: number };
}
