import loadProgressRoute from "./load-progress.route";
import saveProgressRoute from "./save-progress.route";
import clearProgressRoute from "./clear-progress.route";
import { Router } from "express";

const router = Router();

router.use("/", loadProgressRoute);
router.use("/", saveProgressRoute);
router.use("/", clearProgressRoute);

export default router;
