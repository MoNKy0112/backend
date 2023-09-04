import {Router} from 'express';
import {createNewOrder, getOrderById, getOrders} from '../controllers/order.controller';
import {verifyCartProducts} from '../middlewares/verifyCartProducts';

const router: Router = Router();

// Router.get('/:orderId', getOrderById);
router.get('/getorder', getOrders);
router.post('/createorder', verifyCartProducts, createNewOrder);
export default router;
