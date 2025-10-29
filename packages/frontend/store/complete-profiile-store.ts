import api from "@/services/api";
import {
  GlobalRole,
  ParentStudent,
  Profile,
  School,
  Staff,
  Student,
  Teacher,
} from "@stackschool/db";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SchoolData {
  type: "join" | "create" | "invite";
  schoolId?: string;
  newSchool?: School;
  invitationCode?: string;
  imposedRole?: string;
}

interface RoleData {
  role: GlobalRole;
  student?: Student;
  teacher?: Teacher;
  staff?: Staff;
  parent?: ParentStudent;
}

interface CompleteProfileStep {
  school?: SchoolData | null;
  profile: Profile | null;
  role: RoleData | null;
  lastSavedAt: string | null;

  setSchoolData: (school: SchoolData) => void;
  setProfileData: (profile: Profile) => void;
  setRole: (role: RoleData) => void;
  reset: () => void;
  saveToRedis: () => Promise<void>;
  loadFromRedis: () => Promise<boolean | undefined>;
  clearAllData: () => Promise<void>;
  setCurrentStep: (step: number) => void;
  submitCompleteProfile: () => Promise<{
    success: boolean;
    error?: string | any;
  }>;

  isSubmitting: boolean;
  currentStep: number;
}

export const completeProfileStore = create<CompleteProfileStep>()(
  persist(
    (set, get) => ({
      school: null,
      profile: null,
      role: null,
      lastSavedAt: null,
      currentStep: 1,
      isSubmitting: false,

      setSchoolData: async (data) => {
        set({ school: data });
        await get().saveToRedis();
      },
      setProfileData: async (data) => {
        set({ profile: data });
        await get().saveToRedis();
      },

      setCurrentStep: async (step) => {
        set({ currentStep: step });
        await get().saveToRedis();
      },

      setRole: async (role: RoleData) => {
        set({ role });
        await get().saveToRedis();
      },
      reset: () =>
        set({
          school: null,
          profile: null,
          role: null,
          isSubmitting: false,
          currentStep: 1,
          lastSavedAt: null,
        }),

      saveToRedis: async () => {
        const state = get();
        try {
          const res = await api.post("/api/complete-profile/save-progress", {
            school: state.school,
            profile: state.profile,
            role: state.role,
            currentStep: state.currentStep,
          });
          if (res.data?.ok) set({ lastSavedAt: new Date().toISOString() });
        } catch (error) {
          console.warn(
            "Échec sauvegarde Redis, continuation avec localStorage"
          );
        }
      },

      loadFromRedis: async () => {
        try {
          const res = await api.get("/api/complete-profile/load-progress");
          if (res.data?.ok) {
            const { data } = res;
            if (data && data.currentStep) {
              set({
                school: data.school,
                role: data.role,
                profile: data.profile,
                currentStep: data.currentStep,
                lastSavedAt: data.savedAt,
              });
            }
            return true;
          }
        } catch (error) {
          console.warn("Échec chargement Redis, utilisation localStorage");
        }
        return false;
      },

      clearAllData: async () => {
        get().reset();

        try {
          await api.post("/api/complete-profile/clear-progress");
        } catch (error) {}
      },

      submitCompleteProfile: async () => {
        const { school, role, profile, clearAllData } = get();

        if (!school || !role || !profile)
          return { success: false, error: "Données manquantes" };

        set({ isSubmitting: true });

        try {
          const res = await api.post("/api/complete-profile", {
            school,
            role,
            profile,
          });
          const { data } = res;
          if (data.success) {
            await clearAllData();
            return { success: true };
          } else {
            return { success: true, error: data?.message };
          }
        } catch (error) {
          console.error("Erreur soumission profil:", error);
          return { success: false, error: "Erreur réseau" };
        } finally {
          set({ isSubmitting: false });
        }
      },
    }),
    {
      name: "complete-profile-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
