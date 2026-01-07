import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth';
import { profileSchema, ZodError } from '@stackschool/shared';
import { redisClient } from '../../lib/redis';
import { safeValidateSchema } from '../../utils/validate-schema.util';

const router = Router();

router.put('/profile', isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user?.id;

    const errors = safeValidateSchema(profileSchema, req.body);
    if (errors) return next(errors);
    const redisKey = `complete_profile:${userId}`;

    const existingData = await redisClient.get(redisKey);
    const profileData = existingData ? JSON.parse(existingData) : req.body;
    await redisClient.setEx(
      redisKey,
      24 * 60 * 600,
      JSON.stringify(profileData),
    );
    return res.json({
      ok: true,
      message: 'Profil sauvegardé temporairement',
      profile: profileData,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: 'Données invalides',
        errors: error.message,
      });
    }

    console.error('Erreur sauvegarde profil:', error);
    return res.status(500).json({
      ok: false,
      message: 'Erreur lors de la sauvegarde du profil',
    });
  }
});

export default router;
