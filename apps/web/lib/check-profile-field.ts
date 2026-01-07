import api, { parseAxiosError } from '@stackschool/shared/src/lib/api';

// lib/check-profile-field.ts
export async function checkField(
  field: string,
  value: string,
): Promise<{
  valid?: boolean;
  message: string;
  field?: string;
  status?: number | null;
} | null> {
  try {
    const response = await api.get(`/validate/user-field?${field}=${value}`);
    if (response.data) {
      return {
        status: response.status,
        valid: response.data.valid,
        message: response.data.message,
        field: response.data.field,
      };
    }
    return null;
  } catch (error: any) {
    const { message } = parseAxiosError(error);
    return {
      status: error.status,
      valid: false,
      message: message || 'Identifiant invalide',
      field: field,
    };
  }
}
