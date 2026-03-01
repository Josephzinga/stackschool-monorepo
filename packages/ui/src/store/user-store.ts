import { create } from 'zustand';
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
    }),
    {
      name: 'user-storage', // Nom de la clé dans localStorage
      partialize: (state) => ({ currentSchool: state.currentSchool }), // On ne persiste que l'école choisie
    },
  ),
);
