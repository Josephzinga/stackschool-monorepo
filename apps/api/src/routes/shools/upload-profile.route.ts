import { Router } from 'express';
import multer from 'multer';
import { isAuthenticated } from '../../middlewares/auth';
import path from 'path';
import { validateUploadedImage } from '../../middlewares/validate-profile-picture';
import { redisClient } from '../../lib/redis';
import { prisma } from '@stackschool/db';

const router = Router();

const IMAGES_DIR = path.resolve(process.cwd(), 'public', 'images');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, IMAGES_DIR);
  },

  filename: (req, file, cb) => {
    const user = req.user;
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    const safeName = `${user?.id}-${unique}${ext}`;
    cb(null, safeName);
  },
});

const uploadProfile = multer({ storage: storage });

router.post(
  '/profile-picture',
  isAuthenticated,
  uploadProfile.single('profilePicture'),
  validateUploadedImage,
  async (req, res) => {
    try {
      const isOnCompleteProfile: boolean =
        req.body.isOnCompleteProfile || false;
      const profileId = req.body.profileId as string;
      const user = req.user;
      if (!req.file) throw new Error('Pas de fichier après multer');

      const publicPath = `/images/${req.file.filename}`;
      if (isOnCompleteProfile) {
        const key = `pendingPhoto${user?.id}`;

        await redisClient.set(key, publicPath);

        return res.status(200).json({
          ok: true,
          message: `Image sauvegardée temporairement.`,
          path: publicPath,
        });
      }
      console.log('user', user);
      const profile = await prisma.profile.update({
        where: {
          userId: user?.id,
        },
        data: {
          photo: publicPath,
        },
        select: {
          photo: true,
        },
      });

      return res.status(200).json({
        ok: true,
        message: 'Image sauvegardée avec succès.',
        path: profile?.photo,
      });
    } catch (err) {
      console.error('Upload error', err);
      return res
        .status(500)
        .json({ ok: false, error: 'Erreur pendant upload' });
    }
  },
);

export default router;
