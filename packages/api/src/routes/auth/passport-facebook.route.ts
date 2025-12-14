import { Router } from "express";
import passport from "passport";
import { generateToken } from "../../lib/outils";
import { prisma } from "../../lib/prisma";
import { User } from "@stackschool/db";
import handleSocialRoutes from "../../lib/passport-social";
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
  async (req, res) => handleSocialRoutes(req, res, "facebook")
);

export default router;
