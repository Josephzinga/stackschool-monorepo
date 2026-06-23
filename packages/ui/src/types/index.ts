import {
  PermissionCode,
  ProfileData,
  RoleDataType,
  SchoolDataType,
} from '@stackschool/shared';
import { School, SchoolMembership, User } from '../generated/graphql';

type CurrentSchool = Omit<School, 'students' | 'teachers'>;

type CurrentMemberShip = Omit<SchoolMembership, 'school'>;

export interface UserStore {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  currentSchool: CurrentSchool | null;
  currentMemberShip: CurrentMemberShip | null;

  setCurrentSchool: (school?: CurrentSchool) => void;
  setCurrentMemberShip: (memberShip: CurrentMemberShip) => void;
}

export interface CompleteProfileStep {
  school: SchoolDataType | null;
  profile: ProfileData | null;
  role: RoleDataType | null;
  lastSavedAt: string | null;
  error?: string | null;
  isSubmitting: boolean;
  currentStep: number;

  reset: () => void;
  setError: (err: string | null) => void;

  setSchoolData: (school: SchoolDataType) => void;
  setProfileData: (profileData: ProfileData) => void;
  setRoleData: (roleData: RoleDataType) => void;
  saveToRedis: () => Promise<void | { success: boolean; error?: string }>;
  loadFromRedis: () => Promise<
    boolean | undefined | { success: boolean; error?: string }
  >;
  clearAllData: () => Promise<void>;
  setCurrentStep: (step: number) => void;

  submitCompleteProfile: () => Promise<{
    success: boolean;
    error?: string | any;
  }>;
}
