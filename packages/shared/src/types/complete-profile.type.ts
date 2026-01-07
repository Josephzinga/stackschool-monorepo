import type {
  Account,
  Gender,
  Profile,
  SchoolRole,
  Staff,
  Teacher,
  User,
} from '@stackschool/db';
import {
  CreateSchoolType,
  ParentFormData,
  StudentFormData,
} from '../validation/complete-profile.schema';

type CreateSchoolPayload = {
  type: 'create';
  newSchool: CreateSchoolType;
};

type JoinSchoolPayload = {
  type: 'join';
  schoolId: string;
};

type InviteSchoolPayload = {
  type: 'invite';
  invitationCode: string;
};
export type SchoolData =
  | CreateSchoolPayload
  | JoinSchoolPayload
  | InviteSchoolPayload;

export interface RoleData {
  role: SchoolRole;
  student?: StudentFormData;
  teacher?: Teacher;
  staff?: Staff;
  parent?: ParentFormData;
}

export interface ProfileData {
  firstname: string;
  lastname: string;
  gender: Gender;
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
  _count: { students: number };
}
