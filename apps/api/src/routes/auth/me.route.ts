import { Request, Response, Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth';
import { prisma } from '@stackschool/db';

const router = Router();

router.get('/me', isAuthenticated, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return;
  let provider = null;
  for (const p of user.Account) {
    if (p.provider) {
      provider = p.provider;
    }
  }
  const roleData = prisma.schoolUser.findUnique({
    where: {
      schoolId_userId: { schoolId: '', userId: user?.id as string },
    },
  });
  return res.json({
    ok: true,
    user: {
      email: user.email ?? null,
      id: user?.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      profileCompleted: user.profileCompleted,
      provider,
      profile: user.profile ?? null,
      hasMembership: user.hasMembership,
    },
  });
});

export default router;
