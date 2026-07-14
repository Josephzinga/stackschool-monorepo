export type PermissionCode = '';
interface HasPermissionOptions {
  /**
   * Si 'all' est vrai, l'utilisateur doit posséder TOUTES les permissions demandées.
   * Si 'all' est faux (par défaut), posséder AU MOINS UNE des permissions suffit.
   */
  all?: boolean;
}

/**
 * Vérifie si un utilisateur possède les permissions requises.
 * Fonction pure utilisable côté Client (React) et Serveur (GraphQL/Node).
 */
export function hasPermission(
  userPermissionCodes: PermissionCode[],
  requiredPermissions: PermissionCode | PermissionCode[],
  options: HasPermissionOptions = { all: false },
): boolean {
  // Si aucune permission n'est requise, l'accès est accordé
  if (
    !requiredPermissions ||
    (Array.isArray(requiredPermissions) && requiredPermissions.length === 0)
  ) {
    return true;
  }

  // Normaliser la permission requise en tableau
  const requiredList = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  if (options.all) {
    // L'utilisateur doit avoir CHAQUE permission requise
    return requiredList.every((perm) => userPermissionCodes.includes(perm));
  }

  // L'utilisateur doit avoir AU MOINS UNE des permissions requises
  return requiredList.some((perm) => userPermissionCodes.includes(perm));
}

export type HasPermission = typeof hasPermission;
