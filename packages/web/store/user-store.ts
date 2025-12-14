// store/user-store.ts
import { create } from "zustand";
import { UserInMe } from "@stackschool/shared";
import api from "@/services/api";

interface UserState {
  user: UserInMe | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserInMe | null) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
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
      const res = await api.get("/auth/me");
      console.log("requête avec sucess in me", res.data);

      if (res.data?.ok && res.data.user) {
        console.log("data in me ", res.data.user);
        set({
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
        });
        return;
      }

      const refresh = await api.post("/auth/refresh");
      console.log("post refresh", refresh.data);

      if (refresh.data?.ok) {
        const res2 = await api.get("/auth/me");

        if (res2.data?.ok && res2.data.user) {
          set({
            isAuthenticated: true,
            user: res2.data.user,
            loading: false,
          });
          return;
        }
      }

      throw new Error("Not authenticated");
    } catch (err) {
      console.error("Erreur d'authentification:", err);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
