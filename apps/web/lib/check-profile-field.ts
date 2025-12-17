import api from "@stackschool/shared/src/lib/api";

// lib/check-profile-field.ts
export async function checkField(field: string, value: string) {
  try {
    const response = await api.get("/validate/user-field", {
      params: { field: value },
    });

    return {
      valid: response.data.valid,
      message: response.data.message,
      field: response.data.field,
    };
  } catch (error) {
    console.error(`Error checking ${field}:`, error);
    return {
      valid: false,
      message: "Erreur de validation",
      field: field,
    };
  }
}
