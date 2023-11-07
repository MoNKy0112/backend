import {Router} from 'express';
import {createNewOrder, getOrderById, getOrders} from '../controllers/order.controller';
import {verifyCartProducts} from '../middlewares/verifyCartProducts';
import {tokenValidation} from '../middlewares/validateToken';

const router: Router = Router();

router.get('/orders/:orderId', getOrderById);
router.post('/createorder', tokenValidation, verifyCartProducts, createNewOrder);
export default router;
