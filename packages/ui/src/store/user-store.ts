import { create } from 'zustand';
import { UserStore } from '../types';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      isAuthenticated: false,
      currentSchool: null,
      currentMemberShip: null,


      setCurrentMemberShip: (memberShip)=> {
        set({
          currentMemberShip: memberShip
        })
      } ,
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
      partialize: (state) => ({ currentSchool: state.currentSchool, currentMemberShip: state.currentMemberShip }), // On ne persiste que l'école choisie
      storage: createJSONStorage(() => sessionStorage)
    },
  ),
);
