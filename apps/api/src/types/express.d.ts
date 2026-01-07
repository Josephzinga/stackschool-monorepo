import { UserInMe } from '@stackschool/shared';

declare global {
  namespace Express {
    interface Request {
      user?: UserInMe;
    }
  }
}
