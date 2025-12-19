import { Router } from "express";
import passport from "passport";
import handleSocialRoutes from "../../lib/passport-social";
import { getPlateForm } from "../../utils/deep.link";
const router = Router();
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

router.get("/facebook", (req, res, next) => {
  const state = getPlateForm(req);
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
    state,
  })(req, res, next);
});

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${FRONTEND_ORIGIN}/auth/login`,
    session: true,
  }),
  async (req, res) => handleSocialRoutes(req, res, "facebook")
);

export default router;
