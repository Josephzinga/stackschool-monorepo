import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth";
import { Gender, User } from "@stackschool/db";
import { profileSchema, ZodError } from "@stackschool/shared";
import { redisClient } from "../../lib/redis";

const router = Router();

router.put("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = req.user as User;
    const userId = user?.id;

    const { firstname, lastname, gender, photo, email, phoneNumber } =
      req.body as {
        firstname: string;
        lastname: string;
        gender: Gender;
        photo?: string;
        email?: string;
        phoneNumber?: string;
      };

    const redisKey = `complete_profile:${userId}`;
    const existingData = await redisClient.get(redisKey);
    const profileData = existingData ? JSON.parse(existingData) : {};
    const validatedData = profileSchema.parse({
      firstname,
      lastname,
      gender,
      photo,
    });

    profileData.profile = validatedData;

    await redisClient.setEx(userId, 24 * 60 * 600, JSON.stringify(profileData));
    return res.json({
      ok: true,
      message: "Profil sauvegardé temporairement",
      profile: validatedData,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Données invalides",
        errors: error.issues,
      });
    }

    console.error("Erreur sauvegarde profil:", error);
    return res.status(500).json({
      ok: false,
      message: "Erreur lors de la sauvegarde du profil",
    });
  }
});

export default router;
