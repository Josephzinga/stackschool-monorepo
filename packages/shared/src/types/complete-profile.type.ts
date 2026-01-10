import type {
  Account,
  Gender,
  Profile,
  School,
  SchoolRole,
  Staff,
  Teacher,
  User,
} from '@stackschool/db';
import {
  CreateSchoolType,
  ParentFormData,
  StudentFormData,
} from '@stackschool/shared/src';

type CreateSchoolPayload = {
  type: 'create';
  newSchool: CreateSchoolType;
};

type JoinSchoolPayload = {
  type: 'join';
  schoolSelected: Pick<School, 'name' | 'id' | 'code' | 'address' | 'logo'>;
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

export interface UserInMe extends User {
  profile: Profile;
  Account: Account[];
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  _count: { students: number };
}
