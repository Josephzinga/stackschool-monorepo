import * as bcrypt from 'bcryptjs';
import { VerifyCallback } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma';
import { Account } from '@stackschool/db';
import { loginFormSchema } from '@stackschool/shared';
import { safeValidate } from '../utils/validation.util';

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
  // helper de validation zod
  const errors = safeValidate(loginFormSchema, { identifier, password });
  if (errors) {
    return done(errors);
  }
  try {
    const input = identifier || '';
    // recherche de l'utilisateur par l'identifiant (email, password, phoneNumber) et inclure le profile et account dans le donné renvoyé
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

    if (!user) return done(null, false, { message: 'Utilisateur introuvable' });

    // on parcourt les comptes pour filtrer seulement les sociaux
    const providers = user.Account
      ? user.Account.map((acc: Account) => acc.provider).filter(
          (p: string | null) => p !== 'local',
        )
      : [];
    // vérifie s'il y a ou-mois un caractère dans le mot de passe
    const hasPassword =
      typeof user.password === 'string' && user.password.length > 0;
    // s'il n'y a pas de mot de passe, il vient des providers
    if (!hasPassword) {
      return done(null, false, {
        message: `Ce compte utilise : ${providers.join(
          ', ',
        )} veilliez vous connecter avec.`,
        isSocialOnly: true,
        providers,
      });
    }
    // Comparaison du mot passe
    const match = await bcrypt.compare(password, user.password as string);
    if (!match) return done(null, false, { message: 'Identifiants invalides' });

    // donne l'user ou l'erreur à passport
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}
