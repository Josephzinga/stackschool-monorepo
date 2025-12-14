import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth";
import { User } from "@stackschool/db";
import { redisClient } from "../../lib/redis";

const router = Router();

router.delete("/clear-progress", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const redisKey = `complete_profile:${userId}`;

    await redisClient.del(redisKey);

    return res.status(200).json({
      success: true,
      message: "Progression nettoyée",
    });
  } catch (error) {
    console.error("Erreur nettoyage progression:", error);
    return res.status(500).json({ error: "Erreur lors du nettoyage" });
  }
});

export default router;
