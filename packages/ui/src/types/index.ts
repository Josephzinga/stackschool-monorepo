import { ProfileData, RoleData, SchoolData } from '@stackschool/shared';
import { GetMeQuery, SchoolMembership } from '@stackschool/ui/src';

export interface UserStore {
  user: GetMeQuery['me'] | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: GetMeQuery['me'] | null) => void;
  fetchUser: () => Promise<void>;
  currentSchool: SchoolMembership | null; // Remplacez 'any' par le type School importé
  setCurrentSchool: (school: SchoolMembership) => void;
}

export interface CompleteProfileStep {
  school: SchoolData | null;
  profile: ProfileData | null;
  role: RoleData | null;
  lastSavedAt: string | null;
  error?: string | null;
  isSubmitting: boolean;
  currentStep: number;

  reset: () => void;
  setError: (err: string | null) => void;

  setSchoolData: (school: SchoolData) => void;
  setProfileData: (profileData: ProfileData) => void;
  setRoleData: (roleData: RoleData) => void;
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
