import {api, authServices, parseAxiosError, RedisService} from '@stackschool/contracts';
import {create} from 'zustand';
import {CompleteProfileStep} from '../types';
import {createJSONStorage, persist} from 'zustand/middleware';

const redisService = new RedisService(api);

export const useCompleteProfileStore = create<CompleteProfileStep>()(
  persist(
    (set, get) => ({
      school: null,
      profile: null,
      role: null,
      lastSavedAt: null,
      currentStep: 1,
      isSubmitting: false,
      error: null,

      setSchoolData: async (data) => {
        set({ school: data });
        await get().saveToRedis();
      },
      setProfileData: async (profileData) => {
        set({ profile: profileData, currentStep: 3 });

        await get().saveToRedis();
      },

      setCurrentStep: async (step) => {
        const state = get();

        if (step >= state.currentStep) {
          if (
            step <= 2 &&
            !(state.school?.type === 'join'
              ? state.school.schoolSelected
              : state.school?.type == 'create'
                ? state.school.newSchool
                : false)
          ) {
            set({
              error: "Veuillez d'abord joindre ou crée une école.",
            });

            return;
          }

          if (step >= 3 && !state.profile) {
            set({ error: "Veuillez d'abord compléter votre profil." });
            return;
          }

          if (step >= 4 && !state.role) {
            set({ error: "Veuillez d'abord définir votre rôle." });
            return;
          }
        }

        set({ currentStep: step });
        // On sauvegarde l'étape courante dans Redis pour reprendre plus tard
        await get().saveToRedis();
      },

      setRoleData: async (role) => {
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
        try {
          const state = get();
          const res = await redisService.saveProgressToRedis({
            school: state.school || null,
            profile: state.profile || null,
            role: state.role,
            currentStep: state.currentStep,
          });

          if (res?.ok) {
            set({ lastSavedAt: new Date().toISOString() });
          }
        } catch (error) {
          const { message, data } = parseAxiosError(error);
          set({ error: message });
          return {
            success: false,
            error: 'Échec sauvegarde Redis, utilisation localStorage',
          };
        }
      },

      loadFromRedis: async () => {
        try {
          const res = await redisService.loadFromRedis();
          if (res.ok) {
            const data = res.data;
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
          return {
            success: false,
            error: 'Échec chargement Redis, utilisation localStorage',
          };
        }
      },
      setError: (err) => set({ error: err }),

      clearAllData: async () => {
        get().reset();

        try {
          await redisService.clearAllData();
        } catch (error) {}
      },

      submitCompleteProfile: async () => {
        const { school, role, profile, clearAllData } = get();

        if (!school || !role || !profile)
          return { success: false, error: 'Données manquantes' };

        set({ isSubmitting: true });

        try {
          const data = await authServices.completeProfile({
            school,
            role,
            profile,
          });

          if (data.success) {
            await clearAllData();
            return { success: true };
          } else {
            return { success: true, error: data?.message };
          }
        } catch (error) {
          console.error('Erreur soumission profil:', error);
          return { success: false, error: 'Erreur réseau' };
        } finally {
          set({ isSubmitting: false });
        }
      },
    }),
    {
      name: 'complete-profile-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
