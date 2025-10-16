import { Router } from "express";
import localStrategy from "passport-local";
import passport from "passport";
import { verify } from "crypto";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Profile } from "../generated/client";

const router = Router();
async function handleOauthCallback({
  provider,
  profile,
  accessToken,
  refreshToken,
}: {
  provider: string;
  profile: any;
  accessToken: string;
  refreshToken: string;
}) {
  const providerAccountId = profile.id;
  const email = profile.emails?.[0]?.value;
  const displayName = profile.displayName || "";
  const avatar = profile.photo?.[0]?.value;

  const part = displayName.trim().split("/s+/");
  const firstname = part.shift() || "";
  const lastname = part.join("") || "";

  // cherche Acount existant (user déjà lier avec ce provider)

  const account = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: { include: { profile: true } } },
  });
  if (account) {
    await prisma.account.create({
      where: { id: account.id },
      data: { access_token: accessToken, refresh_token: refreshToken },
    });

    return account.user;
  }

  if (email) {
    const userByEmail = await prisma.user.findUnique({
      where: { email },
      include: { profile: true, Account: true },
    });
    if (userByEmail?.profile) {
      await prisma.account.create({
        data: {
          provider,
          providerAccountId,
          access_token: accessToken,
          refresh_token: refreshToken,
          user: { connect: { id: userByEmail.id } },
        },
      });
    } else {
      if (!userByEmail?.profile?.image && avatar) {
        await prisma.profile.update({
          where: { id: userByEmail?.profile?.id },
          data: { image: avatar },
        });
      }
    }
    return await prisma.user.findUnique({
      where: { id: userByEmail?.id },
      include: { profile: true },
    });
  }

  const safeEmail: string =
    email ?? `${provider}:${providerAccountId}@local.invalid`;

  const newUser = await prisma.user.create({
    data: {
      email: safeEmail,
      emailVerified: new Date(),
      profile: {
        create: {
          firstname,
          lastname,
          image: avatar,
        },
      },
    },
  });
}

export default router;
