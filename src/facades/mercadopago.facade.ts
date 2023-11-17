/* eslint-disable @typescript-eslint/naming-convention */
import MercadoPagoConfig, {MerchantOrder, Preference, Payment, OAuth} from 'mercadopago';

import OrderFacade from './order.facade';
import {type ObjectId} from 'mongoose';
import type {IOrder, IPayItem} from '../models/Order';
import ProductFacade from './product.facade';
import userFacade from './user.facade';
import {type OAuthResponse} from 'mercadopago/dist/clients/oAuth/commonTypes';
import config from '../config';
import {v4 as uuidv4} from 'uuid';
const tiunAT = 'TEST-4999751880735799-102715-68f114798c57ff6fa5a0c75d88244183-1525915431';
const clientAT = 'TEST-4999751880735799-102722-f86edf9771511613a2956599d623f117-1527430192';
const tiunClient: MercadoPagoConfig = new MercadoPagoConfig({accessToken: tiunAT});
const Sellerclient: MercadoPagoConfig = new MercadoPagoConfig({accessToken: clientAT});

class Mercadopago {
	public async updateOrder(paymentId: string, preferenceId: string, merchantOrderId: string) {
		try {
			const sellerId = (await OrderFacade.getOrderByPreferenceId(preferenceId)).sellerId as string;
			console.log('algo');
			const data = await this.getData(sellerId, paymentId, preferenceId, merchantOrderId);
			const statusOrder = data.paymentData.status!;
			console.log(statusOrder);
			// TODO si statusOrder == rejected returnStock
			const newOrder = await OrderFacade.updateOrderByPreferenceId(preferenceId, statusOrder);
			return newOrder;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error trying to create preference');
			}
		}
	}

	public async createPreference(orderId: string) {
		try {
			const order = await OrderFacade.getOrderById(orderId);
			const sellerAT = (await userFacade.getUserById(order.sellerId)).accessTokenMp;
			if (!sellerAT) throw new Error('usuario sin acccess token mp');
			const client: MercadoPagoConfig = new MercadoPagoConfig({accessToken: sellerAT});
			console.log(client);
			const preference = new Preference(client);
			// If ((await orderFacade.getOrderById(orderId)).preferenceId !== '') throw new Error('This order already has a preference');
			const items = await this.ordertoPay(orderId);
			const preferenceData = {body: {
				items,
				back_urls: {
					success: 'http://localhost:3000/feedback',
					failure: 'http://localhost:3000/feedback',
					pending: 'http://localhost:3000/feedback',
				},
				auto_return: 'approved',
				marketplace_fee: order.totalAmount * 0.05,
				binary_mode: true,
			}};

			const pref = await preference.create(preferenceData);
			if (!pref) throw new Error('Error trying to create preference');
			const newData: Partial<IOrder> = {
				preferenceId: pref.id,
				status: 'pending',
			};
			console.log('pref:::', pref.id);
			await OrderFacade.updateOrder(orderId, newData);
			return pref;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error trying to create preference');
			}
		}
	}

	public async ordertoPay(orderId: ObjectId | string): Promise<IPayItem[]> {
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
					console.error('error', error);
					// TODO updateorder borrando el producto que no esta
					throw error;
				}
			}),
		);
		console.log('paymentItems', items);
		return items;
	}

	public async oauth(code: string): Promise<OAuthResponse> {
		try {
			const oauth = new OAuth(tiunClient);
			const data: OAuthResponse = await oauth.create({body: {
				client_secret: process.env.TIUN_CLIENT_SECRET ?? config.TIUN_CLIENT_SECRET,
				client_id: process.env.TIUN_CLIENT_ID ?? config.TIUN_CLIENT_ID,
				code,
				redirect_uri: process.env.REDIRECT_URI ?? config.REDIRECT_URI,
			}});
			if (!data) throw new Error('Error trying oauth with MercadoPago ');
			return data;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error trying oauth with MercadoPago ');
			}
		}
	}

	public getAuthorizationURL() {
		try {
			const oauth = new OAuth(tiunClient);
			const uniqueId: string = uuidv4();
			const url = oauth.getAuthorizationURL({options: {
				client_id: process.env.TIUN_CLIENT_ID ?? config.TIUN_CLIENT_ID,
				state: uniqueId,
				redirect_uri: process.env.REDIRECT_URI ?? config.REDIRECT_URI,
			}});
			if (!url) throw new Error('Error trying to create authorization url ');
			return url;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error trying to create authorization url');
			}
		}
	}

	public async getData(sellerId: string, paymentId: string, preferenceId: string, merchantOrderId: string) {
		try {
			const sellerAT = (await userFacade.getUserById(sellerId)).accessTokenMp;
			const client: MercadoPagoConfig = new MercadoPagoConfig({accessToken: sellerAT});
			const preference = new Preference(client);
			const preferenceData = await preference.get({preferenceId});
			const merchanOrder = new MerchantOrder(client);
			const merchanOrderData = await merchanOrder.get({merchantOrderId});
			const payment = new Payment(client);
			const paymentData = await payment.get({id: paymentId});

			const data = {preferenceData, merchanOrderData, paymentData};
			if (!data) throw new Error('Error obtaining order data in Mercado Pago');
			return data;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error when trying to obtain the data');
			}
		}
	}
}

export default new Mercadopago();
