import api, {parseAxiosError} from "@stackschool/shared/src/lib/api";
import { toast } from "sonner";

// lib/check-profile-field.ts
export async function checkField(field: string, value: string) {
  try {
    const response = await api.get(`/validate/user-field?${field}=${value}`);
    return {
      valid: response.data.valid,
      message: response.data.message,
      field: response.data.field,
    };
  } catch (error) {
    const {message} = parseAxiosError(error)
    console.log(message)
    return {
      valid: false,
      message: message || "Identifiant invalide",
      field: field,
    };
  }
}
