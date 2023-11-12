
/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, {Types, type ObjectId, Mongoose} from 'mongoose';
import {type Request, type Response} from 'express';
import MercadoPagoConfig, {Preference, Payment, PaymentMethod} from 'mercadopago';
import type {PreferenceCreateData} from 'mercadopago/dist/clients/preference/create/types';
import {type PaymentCreateData} from 'mercadopago/dist/clients/payment/create/types';
import {type PaymentResponse} from 'mercadopago/dist/clients/payment/commonTypes';
import mercadopagoFacade from '../facades/mercadopago.facade';
import orderFacade from '../facades/order.facade';
import {type IOrder} from '../models/Order';
import {type IPayItem} from '../models/Order';
import ProductFacade from '../facades/product.facade';
import OrderFacade from '../facades/order.facade';
// Const client = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102715-68f114798c57ff6fa5a0c75d88244183-1525915431'});
const client: MercadoPagoConfig = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102722-f86edf9771511613a2956599d623f117-1527430192'});

export const create_preference = async (req: Request, res: Response) => {
	try {
		console.log('algo');
		const preference = new Preference(client);
		const {orderId} = req.body;
		// If ((await orderFacade.getOrderById(orderId)).preferenceId !== '') throw new Error('This order already has a preference');
		const items = await OrdertoPay(orderId);
		const preferenceData = {body: {
			items,
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
		const newData: Partial<IOrder> = {
			preferenceId: pref.id,
			status: 'pending',
		};
		const order = await orderFacade.updateOrder(orderId, newData);
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
		const statusOrder = data.paymentData.status!;
		console.log(statusOrder);
		// TODO get order by preferenceId

		const newOrder = await orderFacade.getOrderByPreferenceId(ids.preferenceId, statusOrder);
		// Actualizar order status en bd

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

export async function OrdertoPay(orderId: ObjectId | string): Promise<IPayItem[]> {
	const order = await OrderFacade.getOrderById(orderId);

	const items: IPayItem[] = [];

	await Promise.all(
		order.products.map(async product => {
			try {
				const producto = await ProductFacade.getProductById(product.productId);
				const paymentItem: IPayItem = {
					id: String(product.productId),
					title: producto.name,
					quantity: product.quantity,
					currency_id: 'COP',
					unit_price: product.subtotal / product.quantity,
				};

				items.push(paymentItem);
			} catch (error) {
				console.log('error #', error);
			}
		}),
	);
	console.log('paymentItems', items);
	return items;
}
