
/* eslint-disable @typescript-eslint/naming-convention */

import {type Request, type Response} from 'express';
import MercadoPagoConfig, {Preference, Payment, PaymentMethod} from 'mercadopago';
import {type PaymentCreateData} from 'mercadopago/dist/clients/payment/create/types';
import {type PaymentResponse} from 'mercadopago/dist/clients/payment/commonTypes';
// Const client = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102715-68f114798c57ff6fa5a0c75d88244183-1525915431'});
const client: MercadoPagoConfig = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102722-f86edf9771511613a2956599d623f117-1527430192'});

export const create_preference = async (req: Request, res: Response) => {
	try {
		const preference = new Preference(client);
		const preferenceData = {body: {
			items: [
				{
					id:	'1',
					title: 'producto',
					quantity: 1,
					currency_id: 'COP',
					unit_price: 10000,
				},
			],
			back_urls: {
				success: 'http://localhost:3000/feedback',
				failure: 'http://localhost:3000/feedback',
				pending: 'http://localhost:3000/feedback',
			},
			auto_return: 'approved',
			marketplace_fee: 3000,
		}};

		const pref = await preference.create(preferenceData);
		res.status(200).json(pref.id);
	} catch (error) {
		console.log('error #', error);
		res.status(500).json(error);
	}
};

export const getPreference = async (req: Request, res: Response) => {
	try {
		const preference = new Preference(client);
		const pref = await preference.get({preferenceId: '1527430192-cd513639-19dc-46de-83cb-88a5ad15d666'});
		res.status(200).json(pref);
	} catch (error) {
		console.log('error #', error);
		res.status(500).json(error);
	}
};

export const getPaymentMethods = async (req: Request, res: Response) => {
	try {
		const met = new PaymentMethod(client);
		const methods = await met.get().then(console.log);

		res.status(200).json(await met.get());
	} catch (error) {
		console.log('error #', error);
		res.status(500).json(error);
	}
};

export const createPayment = async (req: Request, res: Response) => {
	try {
		const payment = new Payment(client);
		const paymentData: PaymentCreateData = {body: {
			additional_info: {
				ip_address: req.socket.remoteAddress,
			},
			binary_mode: true,
			installments: 1,
			description: 'compra test',
			payer: {
				email: 'test_user_399016827@testuser.com',
				entity_type: 'individual',
				identification: {
					type: 'CC',
					number: '123456789',
				},
			},
			payment_method_id: 'efecty',
			// Transaction_details: {
			// 	financial_institution: '1009',
			// },
			callback_url: 'https://ti-un-front-vr3s.vercel.app',
			transaction_amount: 10000,

		}};
		const paym: PaymentResponse = await payment.create(paymentData);
		res.status(200).json(paym);
	} catch (error) {
		console.log('error #', error);
		res.status(500).json(error);
	}
};
