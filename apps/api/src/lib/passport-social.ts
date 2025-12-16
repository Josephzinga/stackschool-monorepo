import type { Request, Response } from "express";
import { generateToken } from "./outils";
import { prisma } from "../lib/prisma";

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

export default async function handleSocialRoutes(
  req: Request,
  res: Response,
  provider: string
) {
  try {
    console.log(`Handling social route for provider: ${provider}`);
    const user = req.user;
    console.log("user in socilaRoutes", user);

    if (!user || !user.id) {
      res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=auth`);
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

    res.redirect(
      `${FRONTEND_ORIGIN}/auth/finish?from=social&provider=${provider}`
    );
  } catch (err) {
    console.log(`Error get ${provider} callback`, err);
    res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=server`);
  }
}
