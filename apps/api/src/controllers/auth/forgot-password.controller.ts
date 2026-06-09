import { NextFunction, Request, Response, Router } from 'express';
import { forgotPasswordRoute } from '../../routes/auth/forgot-password.route';

const router = Router();

router.post(
  '/forgot-password',
  (req: Request, res: Response, next: NextFunction) =>
    forgotPasswordRoute(req, res, next),
);

export default router;
