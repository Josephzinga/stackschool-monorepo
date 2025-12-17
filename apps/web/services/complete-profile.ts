import { schoolService } from "@stackschool/shared";
import {
  SchoolData,
  RoleData,
  Profile,
  ProfileData,
} from "@stackschool/shared";
import { toast } from "sonner";

export async function searchSchools(
  query: string | null,
  onLoading: (value: boolean) => void
) {
  try {
    onLoading(true);
    return await schoolService.searchSchools(query);
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
  profile: ProfileData | null;
  role: RoleData | null;
  currentStep: number;
}) {
  const res = await api.post("/complete-profile/save-progress", data);
  return res.data;
}

export async function loadProgressFromRedis() {
  const res = await api.get("/complete-profile/load-progress");
  return res.data;
}

export async function clearProgressFromRedis() {
  await api.post("/complete-profile/clear-progress");
}

export async function submitCompleteProfile(data: {
  school: SchoolData;
  role: RoleData;
  profile: Profile;
}) {
  const res = await api.post("/complete-profile", data);
  return res.data;
}
