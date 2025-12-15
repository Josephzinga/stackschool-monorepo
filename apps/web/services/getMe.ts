import api from "./api";

export const getMeData = async () => {
  try {
    const res = await api.get("/auth/me");

    return res.data;
  } catch (error) {
    console.error("Error fething me", error);
  }
};
