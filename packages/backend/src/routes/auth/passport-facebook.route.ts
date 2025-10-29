import { Router } from "express";
import passport from "passport";
import { generateToken } from "../../lib/outils";
import { prisma } from "../../lib/prisma";
import { User } from "@stackschool/db";

const router = Router();
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${FRONTEND_ORIGIN}/auth/login`,
    session: true,
  }),
  async (req, res) => {
    try {
      const user = req.user as User;
      console.log("user dans le callback facebook");
      if (!user || !user.id) {
        res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=auth`);
      }

      const refreshToken = generateToken(32);
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);

      await prisma.session.create({
        data: {
          sessionToken: refreshToken,
          expires,
          userId: user.id,
        },
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 25,
      });

      res.redirect(
        `${FRONTEND_ORIGIN}/auth/finish?from=social&provider=facebook`
      );
    } catch (err) {
      console.log("Error get facebook callback", err);
      res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=server`);
    }
  }
);

export default router;
