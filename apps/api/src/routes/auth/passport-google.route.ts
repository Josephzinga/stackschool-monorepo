import { Router } from "express";
import passport from "passport";
import handleSocialRoutes from "../../lib/passport-social";
import { getPlateForm } from "../../utils/deep.link";

const router = Router();

router.get("/google", (req, res, next) => {
  const state = getPlateForm(req);

  passport.authenticate("google", { scope: ["email", "profile"], state })(
    req,
    res,
    next
  );
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    session: true,
  }),
  (req, res) => handleSocialRoutes(req, res, "google")
);

export default router;
