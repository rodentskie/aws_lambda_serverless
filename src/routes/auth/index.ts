import Router from '@koa/router';
import { authUser } from '../../resources/auth';
const router = new Router();

router.post('/auth', authUser);

export = router;
