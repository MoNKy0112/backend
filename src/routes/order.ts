import {Router} from 'express';
import {createNewOrder} from '../controllers/order.controller';
import {verifyCartProducts} from '../middlewares/verifyCartProducts';

const router: Router = Router();

router.get('/:orderId');
router.post('/createorder', verifyCartProducts, createNewOrder);
export default router;
