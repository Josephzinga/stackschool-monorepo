import refreshRoute from "./refresh.route";
import meRoute from "./me.route";
import logoutRoute from "./logout.route";
import passportRoutes from "./passport-google.route";
import loginRoute from "./login.route";
import registerRoute from "./register.route";
import forgotPasswordRoute from "./forgot-password.route";
import verifyCodeRoute from "./verify-code.route";
import facebookRoutes from "./passport-facebook.route";
import { Router } from "express";

const router = Router();

router.use("/auth", refreshRoute);
router.use("/auth", meRoute);
router.use("/auth", logoutRoute);
router.use("/auth", passportRoutes);
router.use("/auth", loginRoute);
router.use("/auth", registerRoute);
router.use("/auth", forgotPasswordRoute);
router.use("/auth", verifyCodeRoute);
router.use("/auth", facebookRoutes);

export default router;
