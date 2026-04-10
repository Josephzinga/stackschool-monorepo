import { createServiceError } from './api-errors';
import { Context } from '../types/context';

export const checkUserAndSchoolId = (
  user?: Context['user'] | null,
  schoolId?: string | null,
) => {
  if (!user) throw createServiceError('Non authentifié', 401);
  if (!schoolId)
    throw createServiceError("Identifiant de l'établissement manquant", 400);
};
