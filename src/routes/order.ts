import {Router} from 'express';
import {createNewOrder, getOrderById, getOrders} from '../controllers/order.controller';
import {verifyCartProducts} from '../middlewares/verifyCartProducts';

const router: Router = Router();

<<<<<<< HEAD
// Router.get('/:orderId', getOrderById);
router.get('/getorder', getOrders);
=======
router.get('/orders/:orderId', getOrderById);
>>>>>>> main
router.post('/createorder', verifyCartProducts, createNewOrder);
export default router;
