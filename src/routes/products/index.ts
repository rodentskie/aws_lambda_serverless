import Router from '@koa/router';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from '../../resources/products';
import { validateToken } from '../../middlewares/validate-token';

const router = new Router({
  prefix: '/products',
});

router.use(validateToken);

router.post(`/`, addProduct);
router.delete(`/:id`, deleteProduct);
router.patch(`/:id`, updateProduct);
router.get(`/`, getAllProducts);

export = router;
