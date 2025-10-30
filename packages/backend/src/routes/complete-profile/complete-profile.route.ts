import { Router, type Request, Response } from "express";
import { isAuthenticated } from "../../middlewares/auth";
import { redisClient } from "../../lib/redis";

const router = Router();

router.post(
  "/complete-profile",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user as string;
      const redisKey = `complete-profile:${userId}`;

      console.log("userId:", userId);
    } catch (error) {
      console.error("erreur");
    }
  }
);

export default router;
