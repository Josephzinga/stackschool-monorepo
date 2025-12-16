import type {
  Account,
  Gender,
  GlobalRole,
  ParentStudent,
  Profile,
  Staff,
  Student,
  Teacher,
  User,
} from "@stackschool/db";

type CreateSchoolPayload = {
  type: "create";
  newSchool: {
    code: string;
    address: string;
    name: string;
    inposedRole: string;
  };
};

type JoinSchoolPayload = {
  type: "join";
  schoolId: string;
};

type InviteSchoolPayload = {
  type: "invite";
  invitationCode: string;
};
export type SchoolData =
  | CreateSchoolPayload
  | JoinSchoolPayload
  | InviteSchoolPayload;

export interface RoleData {
  role: GlobalRole;
  student?: Student;
  teacher?: Teacher;
  staff?: Staff;
  parent?: ParentStudent;
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
  account: Account;
};
