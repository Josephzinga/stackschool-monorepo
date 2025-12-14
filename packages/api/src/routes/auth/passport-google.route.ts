import { Router } from "express";
import passport from "passport";
import handleSocialRoutes from "../../lib/passport-social";

const router = Router();
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_ORIGIN}/auth/login`,
    session: true,
  }),
  async (req, res) => {
    handleSocialRoutes(req, res, "google");
  }
);

export default router;
