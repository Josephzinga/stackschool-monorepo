import { Router } from "express";
import authRoutes from "./auth";
import completeProfileRoutes from "./complete-profile";
import profileRoute from "./users/profile.route";
import validateUserFieldRoute from "./validationField.route";
import uploadProfilePicture from "./complete-profile/upload-profile.route";
const router = Router();

router.use("/", authRoutes);
router.use("/complete-profile", completeProfileRoutes);
router.use("/", profileRoute);
router.use("/validate", validateUserFieldRoute);
router.use("/upload", uploadProfilePicture);

export default router;
