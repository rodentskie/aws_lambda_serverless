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

router.post(`/`, validateToken, addProduct);
router.delete(`/:id`, validateToken, deleteProduct);
router.patch(`/:id`, validateToken, updateProduct);
router.post(`/`, validateToken, addProduct);
router.get(`/`, getAllProducts);

export = router;
