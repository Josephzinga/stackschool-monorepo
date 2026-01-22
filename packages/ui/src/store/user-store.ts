import { create } from 'zustand';
import { parseAxiosError } from '@stackschool/shared';
import { getSafeMe } from '../lib/get-safe-me';
import { UserStore } from '../types';
import { persist } from 'zustand/middleware';

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      isAuthenticated: false,
      currentSchool: null,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          loading: false,
        });
      },

      setCurrentSchool: (school) => {
        set({ currentSchool: school });
      },

      fetchUser: async () => {
        set({ loading: true });

        try {
          const user = await getSafeMe();
          if (!user) {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              currentSchool: null, // Reset school on logout
            });
            return;
          }
          set({
            user: user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          const { message } = parseAxiosError(err);
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            currentSchool: null,
          });
        }
      },
    }),
    {
      name: 'user-storage', // Nom de la clé dans localStorage
      partialize: (state) => ({ currentSchool: state.currentSchool }), // On ne persiste que l'école choisie
    },
  ),
);
