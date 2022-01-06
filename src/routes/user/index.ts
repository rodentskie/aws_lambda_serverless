import Router from '@koa/router';
import { addUser, getProductsPerUser } from '../../resources/users';

const router = new Router({
  prefix: '/users',
});

router.post('/', addUser);
router.get('/:id', getProductsPerUser);

export = router;
