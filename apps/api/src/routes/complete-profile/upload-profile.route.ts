import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../../middlewares/auth";
import path from "path";
import { validateUploadedImage } from "../../middlewares/validate-profile-picture";
import { redisClient } from "../../lib/redis";

const router = Router();

const IMAGES_DIR = path.resolve(process.cwd(), "public", "images");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, IMAGES_DIR);
  },

  filename: (req, file, cb) => {
    const user = req.user;
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    const safeName = `${user?.id}-${unique}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/profile-picture",
  isAuthenticated,
  upload.single("profilePicture"),
  validateUploadedImage,
  async (req, res) => {
    try {
      const user = req.user;
      if (!req.file) throw new Error("Pas de fichier après multer");

      const publicPath = `/images/${req.file.filename}`;

      const key = `pendingPhoto${user?.id}`;
      const TTL_SECONDS = 60 * 60; // 1 heure

      await redisClient.set(key, publicPath, { EX: TTL_SECONDS });

      return res.status(200).json({
        ok: true,
        message: `Image sauvegardée temporairement.`,
        path: publicPath,
        expiresIn: TTL_SECONDS,
      });
    } catch (err) {
      console.error("Upload error", err);
      return res
        .status(500)
        .json({ ok: false, error: "Erreur pendant l'upload" });
    }
  }
);

export default router;
