import {Router} from 'express';
import {create_preference, getPreference, getAuthorizationURL, linkSeller} from '../controllers/mercadopago.controller';
import path from 'path';
import {tokenValidation} from '../middlewares/validateToken';
import {userVerified} from '../middlewares/userVerified';
const router: Router = Router();

router.post('/create_preference', create_preference);

router.get('/feedback', (req, res) => {
	res.json({
		payment: req.query.payment_id,
		status: req.query.status,
		merchantOrder: req.query.merchant_order_id,
		preferenceId: req.query.preference_id,
	});
});

router.get('/getlink', getAuthorizationURL);
router.post('/getpref', getPreference);
router.post('/linkseller', tokenValidation, userVerified, linkSeller);

// Router.get('/methods', getPaymentMethods);
// router.get('/pay', createPayment);
router.get('/mpago', (req, res) => {
	const srcPath = path.resolve(__dirname, '..', 'public', 'mercadopago.html');
	res.status(200).sendFile(srcPath);
});

export default router;
