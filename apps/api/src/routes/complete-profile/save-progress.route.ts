import { type Request, Response, Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth';
import { redisClient } from '../../lib/redis';

const router = Router();

router.post(
  '/save-progress',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const redisKey = `complete_profile:${userId}`;
      console.log('Body:', req.body);

      const setRedis = await redisClient.setEx(
        redisKey,
        60 * 60 * 24,
        JSON.stringify({
          ...req.body,
          savedAt: new Date().toISOString(),
          userId,
        }),
      );
      console.log('SetREdis:', setRedis);

      return res.status(200).json({
        ok: true,
        message: 'Progression sauvegardée',
        savedAt: new Date().toISOString(),
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
