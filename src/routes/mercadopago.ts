import {Router} from 'express';
import {create_preference, getPreference, getPaymentMethods, createPayment, OrdertoPay} from '../controllers/mercadopago.controller';
import path from 'path';
const router: Router = Router();

router.post('/create_preference', create_preference);

router.get('/feedback', (req, res) => {
	res.json({
		payment: req.query.payment_id,
		status: req.query.status,
		merchantOrder: req.query.merchant_order_id,
	});
});

router.post('/getpref', getPreference);
router.get('/methods', getPaymentMethods);
router.get('/pay', createPayment);
router.get('/mpago', (req, res) => {
	const srcPath = path.resolve(__dirname, '..', 'public', 'mercadopago.html');
	res.status(200).sendFile(srcPath);
});
router.post('/ordertopay', OrdertoPay);

export default router;
