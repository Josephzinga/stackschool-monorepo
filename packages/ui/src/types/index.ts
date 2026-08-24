import {
  ProfileFormType,
  RoleDataType,
  SchoolContract,
  SchoolDataType,
  SchoolUserContract,
  UserWithRelationsContract,
} from '@stackschool/contracts';


type CurrentMemberShip = Omit<SchoolUserContract, 'school'>;

export interface UserStore {
  user: UserWithRelationsContract | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserWithRelationsContract | null) => void;
  currentSchool: SchoolContract | null;
  currentMemberShip: CurrentMemberShip | null;

  setCurrentSchool: (school?: SchoolContract) => void;
  setCurrentMemberShip: (memberShip: CurrentMemberShip) => void;
}

export interface CompleteProfileStep {
  school: SchoolDataType | null;
  profile: ProfileFormType | null;
  role: RoleDataType | null;
  lastSavedAt: string | null;
  error?: string | null;
  isSubmitting: boolean;
  currentStep: number;

  reset: () => void;
  setError: (err: string | null) => void;

  setSchoolData: (school: SchoolDataType) => void;
  setProfileData: (profileData: ProfileFormType) => void;
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
