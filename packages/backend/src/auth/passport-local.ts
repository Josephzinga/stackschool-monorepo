import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { VerifyCallback } from "passport-google-oauth20";

export default async function handleLocalAuth(
  identifier: string,
  password: string,
  done: VerifyCallback
) {
  const input = identifier || "";
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: input, mode: "insensitive" } },
          { username: { equals: input, mode: "insensitive" } },
          { phoneNumber: input },
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
