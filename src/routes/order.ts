import {Router} from 'express';
import {createNewOrder, getOrderById} from '../controllers/order.controller';
import {verifyCartProducts} from '../middlewares/verifyCartProducts';

const router: Router = Router();

router.get('/:orderId', getOrderById);
router.post('/createorder', verifyCartProducts, createNewOrder);
export default router;