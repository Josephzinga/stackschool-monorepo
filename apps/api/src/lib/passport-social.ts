import type { Request, Response } from "express";
import { generateToken } from "./outils";
import { prisma } from "../lib/prisma";
import { User } from "@stackschool/db";

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

type UserWithProfile = User & {
  profileCompleted?: boolean;
};

export default async function handleSocialRoutes(
  req: Request,
  res: Response,
  provider: string
) {
  try {
    const user = req.user as UserWithProfile | undefined;
    console.log("user ", user);
    if (!user || !user.id) {
      res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=auth`);
      return;
    }

    const refreshToken = generateToken(32);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);

    await prisma.session.create({
      data: {
        sessionToken: refreshToken,
        expires,
        userId: user?.id,
      },
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 25,
    });

    if (user.profileCompleted) {
      // Le profil est complet, on redirige vers le tableau de bord
      res.redirect(`${FRONTEND_ORIGIN}/dashboard`);
    } else {
      // Le profil est incomplet, on redirige pour le compléter
      res.redirect(`${FRONTEND_ORIGIN}/auth/complete-profile`);
    }
  } catch (err) {
    console.log(`Error get ${provider} callback`, err);
    res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=server`);
  }
}
