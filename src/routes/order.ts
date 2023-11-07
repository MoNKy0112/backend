import {Router} from 'express';
import {createNewOrder, getOrderById, getOrders} from '../controllers/order.controller';
import {verifyCartProducts} from '../middlewares/verifyCartProducts';
import {tokenValidation} from '../middlewares/validateToken';

const router: Router = Router();

router.use('/orders', tokenValidation);
router.get('/orders', getOrders);
router.get('/orders/:orderId', getOrderById);
router.post('/orders/createorder', verifyCartProducts, createNewOrder);
export default router;
