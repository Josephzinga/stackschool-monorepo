import * as bcrypt from 'bcryptjs';
import { VerifyCallback } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma';
import { loginFormSchema } from '@stackschool/shared';
import { safeValidateSchema } from '../utils/validate-schema.util'; // On garde l'ancien validateur pour l'instant si safeValidate n'est pas prêt
import { analyzeUserAccounts } from '../utils/account-analysis.util';

/**
 * Gère l'authentification locale (stratégie Passport).
 *
 * Cette fonction est appelée par Passport lors d'une tentative de connexion
 * avec un identifiant et un mot de passe. Elle vérifie l'existence de l'utilisateur
 * et la validité du mot de passe.
 *
 * @param {string} identifier - L'identifiant de l'utilisateur (email, username ou numéro de téléphone).
 * @param {string} password - Le mot de passe en clair.
 * @param {VerifyCallback} done - Le callback de Passport pour signaler le succès ou l'échec.
 * @returns {Promise<void>}
 */
export default async function handleLocalAuth(
  identifier: string,
  password: string,
  done: VerifyCallback,
): Promise<void> {
  // Validation des données d'entrée
  const errors = safeValidateSchema(loginFormSchema, { identifier, password });
  if (errors) {
    return done(errors);
  }

  try {
    const input = identifier || '';

    // Recherche de l'utilisateur
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: input, mode: 'insensitive' } },
          { phoneNumber: input },
          { username: { equals: input, mode: 'insensitive' } },
        ],
      },
      include: { profile: true, Account: true },
    });

    if (!user) {
      return done(null, false, { message: 'Utilisateur introuvable' });
    }

    // Analyse des comptes (Local vs Social)
    const { hasLocalPassword, socialProviders, isSocialOnly } =
      analyzeUserAccounts(user);

    // Si l'utilisateur n'a pas de mot de passe (compte social uniquement)
    if (isSocialOnly) {
      return done(null, false, {
        message: `Ce compte utilise : ${socialProviders.join(', ')}. Veuillez vous connecter avec.`,
        isSocialOnly: true,
        providers: socialProviders,
      });
    }

    // Si l'utilisateur a un mot de passe mais qu'il est vide (cas rare/invalide)
    if (!hasLocalPassword) {
      return done(null, false, {
        message: 'Configuration du compte invalide (pas de mot de passe).',
      });
    }

    // Vérification du mot de passe
    const match = await bcrypt.compare(password, user.password as string);
    if (!match) {
      return done(null, false, { message: 'Identifiants invalides' });
    }

    // Authentification réussie
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}
