import api from "../../lib/api";
import { ProfileData, RoleData, SchoolData } from "../../types";

interface Data {
  school: SchoolData | null;
  profile: ProfileData | null;
  role: RoleData | null;
  currentStep: number;
}

export const redisService = {
  saveProgressToRedis: async (data: Data) => {
    const res = await api.post("/complete-profile/save-progress", data);
    return res.data;
  },
  loadFromRedis: async () => {
    const res = await api.get("/complete-profile/load-progress");
    return res.data;
  },
  clearAllData: async () => {
    await api.post("/complete-profile/clear-progress");
  },
};
