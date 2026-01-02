import { Account, User } from '@stackschool/db';

type UserWithAccounts = Partial<User> & {
  Account?: Partial<Account>[];
};

export interface UserAccountAnalysis {
  hasLocalPassword: boolean;
  socialProviders: string[];
  isSocialOnly: boolean;
}

/**
 * Analyse les comptes d'un utilisateur pour déterminer ses méthodes de connexion disponibles.
 *
 * @param {UserWithAccounts} user - L'utilisateur avec ses comptes associés.
 * @returns {UserAccountAnalysis} Le résultat de l'analyse (mot de passe présent, liste des providers sociaux, etc.).
 */
export function analyzeUserAccounts(user: UserWithAccounts): UserAccountAnalysis {
  // Vérifie si l'utilisateur a un mot de passe défini (compte local)
  const hasLocalPassword = typeof user.password === 'string' && user.password.length > 0;

  // Récupère la liste des fournisseurs sociaux (exclut 'local' si présent dans Account, bien que rare avec password séparé)
  const socialProviders = user.Account
    ? user.Account
        .map((acc) => acc.provider)
        .filter((p): p is string => p !== undefined && p !== 'local')
    : [];

  // Un utilisateur est "Social Only" s'il n'a pas de mot de passe mais a des comptes sociaux
  const isSocialOnly = !hasLocalPassword && socialProviders.length > 0;

  return {
    hasLocalPassword,
    socialProviders,
    isSocialOnly,
  };
}
