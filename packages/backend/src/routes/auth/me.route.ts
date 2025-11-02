import { Router, Response, Request } from "express";
import { isAuthenticated } from "../../middlewares/auth";

const router = Router();

router.get("/me", isAuthenticated, async (req: Request, res: Response) => {
  const user = req.user as any;

  return res.json({
    user: {
      email: user.email ?? null,
      id: user.id,
      phoneNumber: user.phoneNumber,
      profile: user.profile ?? null,
    },
  });
});

export default router;
