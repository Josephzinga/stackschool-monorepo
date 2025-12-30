import { ServiceError } from '@stackschool/shared/src/types';

/**
 * Crée une instance standardisée d'erreur de service.
 *
 * Cette fonction utilitaire permet de générer des objets d'erreur cohérents
 * à travers l'application, facilitant la gestion des erreurs dans les contrôleurs
 * et les middlewares.
 *
 * @param {string} message - Le message descriptif de l'erreur.
 * @param {number} [statusCode=500] - Le code de statut HTTP associé à l'erreur (par défaut 500).
 * @param {any} [details] - Des détails supplémentaires optionnels sur l'erreur (ex: erreurs de validation).
 * @returns {ServiceError} Une nouvelle instance de ServiceError.
 *
 * @example
 * // Créer une erreur 404
 * const error = createServiceError("Utilisateur non trouvé", 404);
 *
 * @example
 * // Créer une erreur avec détails
 * const error = createServiceError("Validation échouée", 400, { field: "email", issue: "invalid" });
 */
export function createServiceError(
  message: string,
  statusCode: number = 500,
  details?: any,
): ServiceError {
  return new ServiceError(message, statusCode, details);
}
