import bcrypt from "bcryptjs";
import { VerifyCallback } from "passport-google-oauth20";
import { prisma } from "../lib/prisma";
import { User, Profile, Account } from "@stackschool/db";
import { validateBody, validateLogin } from "./validate";
import { loginFormSchema } from "@stackschool/shared";

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

  if (errors) {
    return done(null, false, errors);
  }
  const input = identifier || "";
  try {
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

    if (!user)
      return done(null, false, { message: "Utilisateur introuvalble" });

    const hasPassword = !!user.password;

    const socialProvider = user.Account?.map((acc) => acc.provider);

    if (!hasPassword)
      return done(null, false, {
        message: "Compte crée via google ou facebook",
        isSocialOnly: true,
        providers: socialProvider,
      });

    const match = await bcrypt.compare(password, user?.password as string);

    if (!match) return done(null, false, { message: "Indentifiant invalides" });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}
