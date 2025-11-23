import bcrypt from "bcryptjs";
import { VerifyCallback } from "passport-google-oauth20";
import { prisma } from "../lib/prisma";
import { User, Profile, Account } from "@stackschool/db";
import { validateLogin } from "./validate";

type UserWithRelations = User & {
  profile?: Profile | null;
  Account?: Account[];
};

export default async function handleLocalAuth(
  identifier: string,
  password: string,
  done: VerifyCallback
) {
  const errors = validateLogin({ identifier, password });
  if (errors) return done(errors);

  try {
    const input = identifier || "";

    const user: UserWithRelations | null = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: input, mode: "insensitive" } },
          { phoneNumber: input },
          { username: { equals: input, mode: "insensitive" } },
        ],
      },
      include: { profile: true, Account: true },
    });

    if (!user) return done(null, false, { message: "Utilisateur introuvable" });

    const providers = user.Account
      ? user.Account.map((acc) => acc.provider).filter((p) => p !== "local")
      : [];

    const hasPassword =
      typeof user.password === "string" && user.password.length > 0;

    if (!hasPassword) {
      return done(null, false, {
        message: `Ce compte utilise : ${providers.join(
          ", "
        )} veilleuz vous connecter avec .`,
        isSocialOnly: true,
        providers,
      });
    }

    const match = await bcrypt.compare(password, user.password as string);
    if (!match) return done(null, false, { message: "Identifiants invalides" });

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}
