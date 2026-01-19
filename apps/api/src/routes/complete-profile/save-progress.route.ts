import { NextFunction, type Request, Response, Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth';
import { redisClient } from '../../lib/redis';
import {
  ProfileFormData,
  profileSchema,
  roleDataSchema,
  schoolDataSchema,
} from '@stackschool/shared';
import { safeValidateSchema } from '../../utils/validate-schema.util';

const router = Router();

router.post(
  '/save-progress',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const { step, school, profile, role } = req.body;

      // Validation des données selon l'étape ou les données reçues
      // Note: Le frontend envoie souvent tout l'objet (school, profile, role) à chaque sauvegarde
      // ou juste la partie modifiée. On valide ce qui est présent.

      if (profile) {
        const { success, errors } = safeValidateSchema<ProfileFormData>(
          profileSchema,
          profile,
        );
        if (!success) {
          return next(errors);
        }
      }

      if (school) {
        const { success, errors } = safeValidateSchema(
          schoolDataSchema,
          school,
        );
        if (!success) {
          return next(errors);
        }
      }

      if (role) {
        const { errors, success } = safeValidateSchema(roleDataSchema, role);
        if (!success) {
          return next(errors);
        }
      }

      const redisKey = `complete_profile:${userId}`;

      // On récupère l'existant pour fusionner (si on envoie des updates partiels)
      const existingDataStr = await redisClient.get(redisKey);
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};

      const newData = {
        ...existingData,
        ...req.body, // Fusionne les nouvelles données (school, profile, role, currentStep)
        savedAt: new Date().toISOString(),
        userId,
      };

      await redisClient.setEx(
        redisKey,
        60 * 60 * 24, // 24h
        JSON.stringify(newData),
      );

      return res.status(200).json({
        ok: true,
        message: 'Progression sauvegardée',
        savedAt: newData.savedAt,
      });
    } catch (error) {
      console.error('Erreur sauvegarde progression:', error);
      return res
        .status(500)
        .json({ ok: false, error: 'Erreur lors de la sauvegarde' });
    }
  },
);

export default router;
