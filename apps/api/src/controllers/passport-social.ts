import { prisma } from "../lib/prisma";
import { $Enums } from "@stackschool/db";
import { StrategyOptions, VerifyCallback } from "passport-google-oauth20";
import { Profile } from "passport";

export default async function handleOauthCallback(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
  provider: string
) {
  try {
    const providerAccountId = profile?.id;
    const emailRaw = profile?.emails?.[0]?.value || null;
    const email = emailRaw ? emailRaw.toLocaleLowerCase() : "";
    const displayName = profile?.displayName ?? "";
    const avatar = profile?.photos?.[0]?.value || null;

    const parts = displayName.trim() ? displayName.trim().split(/\s+/) : [];
    const firstname = parts.shift() ?? "";
    const lastname = parts.join(" ") ?? "";

    // 1) Si un account existant (mappé par provider/providerAccountId) -> update tokens + return user
    const existingAccount = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: { user: { include: { profile: true } } },
    });

    // si l'utilisateur existe on met à jour son account
    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: {
          access_token: accessToken ?? existingAccount.access_token,
          refresh_token: refreshToken ?? existingAccount.refresh_token,
        },
      });

      return done(null, existingAccount.user);
    }

    // 2) Si email présent, on essaie de connecter l'account à l'utilisateur existant (ou créer si absent)
    // Utilise connectOrCreate pour éviter les races et faire un seul appel atomique côté Prisma.
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true, Account: true },
      });
      // si le user avec l'email trouvé on crée un compte
      if (user) {
        // créer l'Account lié à ce user (si déjà lié, on ignore)
        await prisma.account.create({
          data: {
            access_token: accessToken,
            refresh_token: refreshToken,
            provider,
            providerAccountId,
            user: { connect: { id: user.id } },
          },
        });
        // si il y n'a pas de profile
        if (!user?.profile) {
          // on crée un profile pour l'utilisateur

          await prisma.profile.create({
            data: {
              photo: avatar,
              firstname,
              lastname,
              user: { connect: { id: user.id } },
            },
          });
          // si il y a un profile est que cet profile a une photo, en même temps que l'avatar du provider n'est pas null
        } else if (!user?.profile.photo && avatar) {
          // on met à jour le profile de l'utilisateur
          await prisma.profile.update({
            where: { id: user.profile.id },
            data: {
              photo: avatar,
            },
          });
        }
        // recherche un user avec se donnée à jour
        const fresh = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true },
        });
        return done(null, fresh ?? user);
      }
    }

    // si l'utilisateur n'existe pas on le crée
    const safeEmail = email || `${provider}:${providerAccountId}@local.invalid`;

    const newUser = await prisma.user.create({
      data: {
        email: safeEmail,
        emailVerified: email ? new Date() : undefined,
        profile: {
          create: {
            firstname,
            lastname,
            photo: avatar,
          },
        },
        Account: {
          create: {
            provider,
            providerAccountId,
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        },
      },
      include: { profile: true, Account: true },
    });
    return done(null, newUser);
  } catch (err: any) {
    // Si la création échoue à cause d'une contrainte unique (race), on essaye de retrouver l'utilisateur existant

    if (err?.code === "P2002") {
      // tenter de récupérer l'utilisateur par providerAccountId ou email
      try {
        const providerId = profile?.id ?? null;
        const found = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider,
              providerAccountId: providerId,
            },
          },
          include: { user: { include: { profile: true } } },
        });

        if (found) return done(null, found.user);
      } catch (e) {
        done(err);
      }
    }
    return done(err as Error);
  }
}
