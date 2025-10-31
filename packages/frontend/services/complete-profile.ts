import api from "@/services/api";
import { SchoolData, RoleData, Profile } from "@stackschool/shared";
import { toast } from "sonner";

export async function searchSchools(
  query: string,
  onLoading: (value: boolean) => void
) {
  try {
    onLoading(true);
    const res = await api.get("/api/schools", { params: { search: query } });
    return res.data.schools;
  } catch (error) {
    console.error("Erreur réseau ", error);
    toast.error("Erreur de chargement des écoles");
    return [];
  } finally {
    onLoading(false);
  }
}

export async function saveProgressToRedis(data: {
  school: SchoolData | null;
  profile: Profile | null;
  role: RoleData | null;
  currentStep: number;
}) {
  const res = await api.post("/api/complete-profile/save-progress", data);
  return res.data;
}

export async function loadProgressFromRedis() {
  const res = await api.get("/api/complete-profile/load-progress");
  return res.data;
}

export async function clearProgressFromRedis() {
  await api.post("/api/complete-profile/clear-progress");
}

export async function submitCompleteProfile(data: {
  school: SchoolData;
  role: RoleData;
  profile: Profile;
}) {
  const res = await api.post("/api/complete-profile", data);
  return res.data;
}
