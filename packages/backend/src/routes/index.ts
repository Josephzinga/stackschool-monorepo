import { Router } from "express";
import authRoutes from "./auth";
import completeProfileRoutes from "./complete-profile";

const router = Router();

router.use("/", authRoutes);
router.use("/complete-profile", completeProfileRoutes);

export default router;
