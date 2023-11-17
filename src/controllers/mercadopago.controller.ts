/* eslint-disable @typescript-eslint/naming-convention */
import {type Request, type Response} from 'express';
import MercadopagoFacade from '../facades/mercadopago.facade';

import userFacade from '../facades/user.facade';
import {type IUser} from '../models/User';
// Const client = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102715-68f114798c57ff6fa5a0c75d88244183-1525915431'});
export const create_preference = async (req: Request, res: Response) => {
	try {
		const orderId = req.body.orderId as string;
		const pref = await MercadopagoFacade.createPreference(orderId);
		res.status(200).json(pref.id);
	} catch (error) {
		console.error('error #', error);
		res.status(500).json(error);
	}
};

export const getPreference = async (req: Request, res: Response) => {
	try {
		const ids = {
			paymentId: req.body.payId as string,
			preferenceId: req.body.prefId as string,
			merchantOrderId: req.body.merchantOrderId as string,
		};

		const newOrder = await MercadopagoFacade.updateOrder(ids.paymentId, ids.preferenceId, ids.merchantOrderId);
		console.log('algof');
		// Actualizar order status en bd

		res.status(200).json({newOrder});
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json(error);
		}
	}
};

export const linkSeller = async (req: Request, res: Response) => {
	try {
		const code = req.body.code as string;
		const {userId} = req;
		console.log(req.userId);
		const data = await MercadopagoFacade.oauth(code);

		const userData: Partial<IUser> = {
			accessTokenMp: data.access_token,
			refreshTokenMp: data.refresh_token,
		};

		const user = await userFacade.updateUserById(userId, userData);
		res.status(200).json(user);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error.message);
		} else {
			res.status(500).json('Unknown error trying link seller with MercadoPago ');
		}
	}
};

export const getAuthorizationURL = async (req: Request, res: Response) => {
	try {
		const url = MercadopagoFacade.getAuthorizationURL();
		res.status(200).json(url);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json('Unknown error ');
		}
	}
};

// Export const getPaymentMethods = async (req: Request, res: Response) => {
// 	try {
// 		const methods = new PaymentMethod(client);
// 		const methodsData = await methods.get().then(console.log);

// 		res.status(200).json(await methods.get());
// 	} catch (error) {
// 		console.log('error #', error);
// 		res.status(500).json(error);
// 	}
// };

// export const createPayment = async (req: Request, res: Response) => {
// 	try {
// 		const payment = new Payment(client);
// 		const paymentData: PaymentCreateData = {body: {
// 			additional_info: {
// 				ip_address: req.socket.remoteAddress,
// 			},
// 			binary_mode: true,
// 			installments: 1,
// 			description: 'compra test',
// 			payer: {
// 				email: 'test_user_399016827@testuser.com',
// 				entity_type: 'individual',
// 				identification: {
// 					type: 'CC',
// 					number: '123456789',
// 				},
// 			},
// 			payment_method_id: 'efecty',
// 			// Transaction_details: {
// 			// 	financial_institution: '1009',
// 			// },
// 			callback_url: 'https://ti-un-front-vr3s.vercel.app',
// 			transaction_amount: 10000,

// 		}};
// 		const paym: PaymentResponse = await payment.create(paymentData);
// 		res.status(200).json(paym);
// 	} catch (error) {
// 		console.log('error #', error);
// 		res.status(500).json(error);
// 	}
// };
