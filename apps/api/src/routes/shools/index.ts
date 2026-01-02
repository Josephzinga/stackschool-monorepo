import { Router } from 'express';
import getSchoolsClassesRoute from './get-school-classes.route';
import SearchSchoolRoute from './search-school.route';
import studentContext from './student-context.route';

const router = Router();

router.use('/schools', getSchoolsClassesRoute);
router.use('/schools', SearchSchoolRoute);
router.use('/schools', studentContext);

export default router;
