import { UserInMe } from '@stackschool/shared';

declare global {
  namespace Express {
    interface User extends UserInMe {}
  }
}
