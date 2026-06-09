import { NextFunction, type Request, Response, Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth';
import { redisClient } from '../../lib/redis';
import {
  ProfileFormDataType,
  profileSchema,
  RoleDataType,
  roleDataSchema,
  SchoolDataType,
  schoolDataSchema,
} from '@stackschool/shared';
import { safeValidateSchema } from '../../utils/validate-schema.util';

const router = Router();

router.post(
  '/save-progress',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { step, school, profile, role } = req.body as {
        profile: ProfileFormDataType;
        role: RoleDataType;
        school: SchoolDataType;
        step: number;
      };

      if (profile) {
        const { success, errors } = safeValidateSchema(profileSchema, profile);
        if (!success) {
          return next(errors);
        }
      }

      if (school) {
        const result = schoolDataSchema.safeParse(school);
        if (!result.success) {
          return next(result.error);
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
        ...req.body,
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
