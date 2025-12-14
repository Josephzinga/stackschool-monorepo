import { Router, type Request, Response } from "express";
import { isAuthenticated } from "../../middlewares/auth";
import { User } from "@stackschool/db";
import { redisClient } from "../../lib/redis";
import { consumeResendCode } from "../../utils/limiter";

const router = Router();

router.post(
  "/save-progress",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const redisKey = `complete_profile:${userId}`;
      console.log("Body:", req.body);
      console.log("userId:", userId);

      const setRedis = await redisClient.setEx(
        redisKey,
        60 * 60 * 24,
        JSON.stringify({
          ...req.body,
          savedAt: new Date().toISOString(),
          userId,
        })
      );
      console.log("SetREdis:", setRedis);

      return res.status(200).json({
        ok: true,
        message: "Progression sauvegardée",
        savedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erreur sauvegarde progression:", error);
      return res
        .status(500)
        .json({ ok: false, error: "Erreur lors de la sauvegarde" });
    }
  }
);

export default router;
