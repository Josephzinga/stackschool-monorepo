import { Router } from "express";
import passport from "passport";
import handleSocialRoutes from "../../lib/passport-social";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    session: true,
  }),
  (req, res) => handleSocialRoutes(req, res, "google")
);

export default router;
