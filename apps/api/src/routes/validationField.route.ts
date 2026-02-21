import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { validateUserFieldSchema } from '../validations/validation-schema';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.get('/user-field', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const parseResult = validateUserFieldSchema.safeParse(req.query);

    if (!parseResult.success) {
      return res.status(400).json({
        ok: false,
        valid: false,
        message: parseResult.error.issues.map((issue) => issue.message),
      });
    }

    const { email, phoneNumber } = parseResult.data;

    // check email uniqueness
    if (email && user?.email !== email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.json({
          ok: true,
          valid: false,
          field: 'email',
          message: 'Cette valeur est déjà utilisée.',
        });
      }
    }

    if (
      phoneNumber &&
      user?.phoneNumber?.replace(/\s+/g, '') !==
        phoneNumber?.replace(/\s+/g, '')
    ) {
      const existingUser = await prisma.user.findUnique({
        where: {
          phoneNumber: phoneNumber.replace(/\s+/g, ''),
        },
      });

      if (existingUser) {
        return res.json({
          ok: true,
          valid: false,
          field: 'phone',
          message: 'Cette valeur est déjà utilisée.',
        });
      }
    }

    // everything ok
    return res.json({
      ok: true,
      valid: true,
    });
  } catch (err) {
    console.error('validate user field error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
    });
  }
});

export default router;
