import loadProgressRoute from './load-progress.route';
import saveProgressRoute from './save-progress.route';
import clearProgressRoute from './clear-progress.route';
import studentContextRoute from './student-context.route';
import parentContextRoute from './parent-context.route';
import { Router } from 'express';

const router = Router();

router.use('/', loadProgressRoute);
router.use('/', saveProgressRoute);
router.use('/', clearProgressRoute);
router.use('/student', studentContextRoute);
router.use('/parent', parentContextRoute);

export default router;
