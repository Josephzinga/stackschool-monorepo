import type { Request, Response } from "express";
import { generateToken } from "./outils";
import { prisma } from "../lib/prisma";
import { parseState } from "../utils/deep.link";
import { createServiceError } from "../utils/api-response";

export default async function handleSocialRoutes(
  req: Request,
  res: Response,
  provider: string
) {
  try {
    const { plateform } = parseState(req.query.state as string);

    const WEB_URL = process.env.FRONTEND_URL!;
    const MOBILE_URL = process.env.MOBILE_DEEPLINK_URL!;

    const baseUrl = plateform === "mobile" ? MOBILE_URL : WEB_URL;

    const user = req.user;
    console.log("user ", user);
    if (!user || !user.id) {
      res.redirect(`${baseUrl}/auth/login?error=auth`);
      return;
    }

    const refreshToken = generateToken(32);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25); // 25 jours

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

    if (!user.profileCompleted) {
      res.redirect(`${baseUrl}/auth/complete-profile`);
    } else {
      res.redirect(`${baseUrl}/dashboard`);
    }
  } catch (err) {
    createServiceError(`Error get ${provider} callback`, 500, err);
  }
}
