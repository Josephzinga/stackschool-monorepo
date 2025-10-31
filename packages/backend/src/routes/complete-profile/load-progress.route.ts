import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth";
import { User } from "@stackschool/db";
import { redisClient } from "../../lib/redis";
import { success } from "@stackschool/shared";

const router = Router();

router.post("/load-progress", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const redisKey = `complete_profile:${userId}`;

    const saveData = await redisClient.get(redisKey);

    if (!saveData) {
      return res.status(400).json({
        success: true,
        data: null,
        message: "Aucune progression sauvegardée",
      });
    }

    const dataParsed = JSON.parse(saveData);

    if (dataParsed.userId !== userId) {
      await redisClient.del(redisKey);
      return res.status(400).json({
        success: true,
        data: null,
        message: "Données de progression invalides",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        school: dataParsed.school,
        profile: dataParsed.profle,
        role: dataParsed.role,
        currentStep: dataParsed.currentStep,
        savedAt: dataParsed.savedAt,
      },
    });
  } catch (error) {
    console.error("Erreur chargement progression:", error);
    return res.status(500).json({ error: "Erreur lors du chargement" });
  }
});

export default router;
