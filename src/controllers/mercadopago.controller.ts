
/* eslint-disable @typescript-eslint/naming-convention */

import {type Request, type Response} from 'express';
import MercadoPagoConfig, {Preference, Payment, PaymentMethod} from 'mercadopago';
import type {PreferenceCreateData} from 'mercadopago/dist/clients/preference/create/types';
import {type PaymentCreateData} from 'mercadopago/dist/clients/payment/create/types';
import {type PaymentResponse} from 'mercadopago/dist/clients/payment/commonTypes';
import mercadopagoFacade from '../facades/mercadopago.facade';
import orderFacade from '../facades/order.facade';
import {type IOrder} from '../models/Order';
// Const client = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102715-68f114798c57ff6fa5a0c75d88244183-1525915431'});
const client: MercadoPagoConfig = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102722-f86edf9771511613a2956599d623f117-1527430192'});

export const create_preference = async (req: Request, res: Response) => {
	try {
		const preference = new Preference(client);
		const preferenceData: PreferenceCreateData = {body: {
			items: [
				{
					id:	'1',
					title: 'producto',
					quantity: 1,
					currency_id: 'COP',
					unit_price: 10000,
				},
				{
					id:	'2',
					title: 'producto 2',
					quantity: 7,
					currency_id: 'COP',
					unit_price: 800,
				},
			],
			back_urls: {
				success: 'http://localhost:3000/feedback',
				failure: 'http://localhost:3000/feedback',
				pending: 'http://localhost:3000/feedback',
			},
			auto_return: 'approved',
			marketplace_fee: 3000,
			binary_mode: true,
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
		const ids = {
			paymentId: req.body.payId as string,
			preferenceId: req.body.prefId as string,
			merchantOrderId: req.body.merchantOrderId as string,
		};

		const data = await mercadopagoFacade.getData(ids.paymentId, ids.preferenceId, ids.merchantOrderId);
		const statusOrder = data.paymentData.status;
		// TODO get order by preferenceId
		// actualizar order status en bd
		const newData: Partial<IOrder> = {
			status: statusOrder,
		};
		const newOrder = await orderFacade.updateOrder('123123', newData);

		res.status(200).json({data, newOrder});
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json(error);
		}
	}
};

export const getPaymentMethods = async (req: Request, res: Response) => {
	try {
		const methods = new PaymentMethod(client);
		const methodsData = await methods.get().then(console.log);

		res.status(200).json(await methods.get());
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
