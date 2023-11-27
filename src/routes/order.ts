import {Router} from 'express';
import {createNewOrder, getOrderById, getOrders, createMeeting} from '../controllers/order.controller';
import {verifyCartProducts} from '../middlewares/verifyCartProducts';
import {tokenValidation} from '../middlewares/validateToken';
import {userVerified} from '../middlewares/userVerified';
import validate from '../validators/order';
const router: Router = Router();

router.use('/orders', tokenValidation, userVerified);
router.get('/orders', getOrders);
router.get('/orders/:orderId', getOrderById);
router.post('/orders/:orderId/meet', validate.createMeeting, createMeeting);
router.post('/orders/createorder', verifyCartProducts, createNewOrder);
export default router;
