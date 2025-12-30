import { Request } from 'express';

/**
 * Génère un état (state) encodé en base64 contenant la plateforme d'origine.
 *
 * Cette fonction est utilisée lors des flux d'authentification OAuth pour se souvenir
 * si la requête initiale provenait de l'application mobile ou du web.
 * Elle lit le paramètre de requête `plateform`.
 *
 * @param {Request} req - L'objet requête Express contenant les query params.
 * @returns {string} Une chaîne encodée en base64 contenant l'objet JSON { plateform: "mobile" | "web" }.
 */
export function getPlateForm(req: Request): string {
  const platform = req.query.plateform === 'mobile' ? 'mobile' : 'web';

  const state = Buffer.from(JSON.stringify({ plateform: platform })).toString(
    'base64',
  );
  return state;
}

/**
 * Décode et analyse l'état (state) retourné après une redirection OAuth.
 *
 * @param {string} [state] - La chaîne d'état encodée en base64.
 * @returns {any} Un objet contenant la plateforme (ex: { plateform: "mobile" }). Retourne { platform: "web" } par défaut ou en cas d'erreur.
 */
export function parseState(state?: string) {
  try {
    if (!state) return { platform: 'web' };
    return JSON.parse(Buffer.from(state, 'base64').toString());
  } catch {
    return { platform: 'web' };
  }
}
