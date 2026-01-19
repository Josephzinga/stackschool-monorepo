import { create } from 'zustand';
import { parseAxiosError } from '@stackschool/shared';
import { getSafeMe } from '../lib/get-safe-me';
import { UserStore } from '../types';

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      loading: false,
    });
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
        });
        return;
      }
      set({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      const { message } = parseAxiosError(err);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
