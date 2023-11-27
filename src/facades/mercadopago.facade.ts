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
import orderFacade from './order.facade';
import {verifyCartProducts} from 'middlewares/verifyCartProducts';
import productFacade from './product.facade';
import {type IProduct} from 'models/Product';
const tiunAT = 'TEST-4999751880735799-102715-68f114798c57ff6fa5a0c75d88244183-1525915431';
const clientAT = 'TEST-4999751880735799-102722-f86edf9771511613a2956599d623f117-1527430192';
const tiunClient: MercadoPagoConfig = new MercadoPagoConfig({accessToken: tiunAT});
const Sellerclient: MercadoPagoConfig = new MercadoPagoConfig({accessToken: clientAT});

class Mercadopago {
	public async updateOrder(paymentId: string, preferenceId: string, merchantOrderId: string) {
		try {
			const order = await OrderFacade.getOrderByPreferenceId(preferenceId);

			const sellerId = order.sellerId as string;
			const data = await this.getData(sellerId, paymentId, preferenceId, merchantOrderId);
			const statusOrder = data.paymentData.status!;
			if (order.status === 'pending') {
				// Console.log(statusOrder);
				if (statusOrder === 'rejected') await orderFacade.returnStock(order);
			}

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
			// If (!sellerAT) throw new Error('usuario sin acccess token mp');
			const client: MercadoPagoConfig = new MercadoPagoConfig({accessToken: clientAT});
			// Console.log(client);
			const preference = new Preference(client);
			if ((await orderFacade.getOrderById(orderId)).preferenceId !== '_') throw new Error('This order already has a preference');
			if (!await this.verifyProducts(orderId)) throw new Error('Algunos productos de la orden ya no existen');
			const items = await this.ordertoPay(orderId);
			const preferenceData = {body: {
				items,
				back_urls: {
					success: 'http://localhost:3000/payment-status-true',
					failure: 'http://localhost:3000/payment-status-false',
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
					if (error instanceof Error) {
						console.error('error', error);
						throw error;
					}
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
			const client: MercadoPagoConfig = new MercadoPagoConfig({accessToken: clientAT});
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

	private async verifyProducts(orderId: ObjectId | string): Promise<boolean> {
		const order = await OrderFacade.getOrderById(orderId);
		const inexistentProducts: string[] = [];
		for (const product of order.products) {
			try {
				await productFacade.getProductById(product.productId);
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === 'Error trying to get a product for your ID') {
						inexistentProducts.push(product.productId as string);
					}
				}
			}
		}

		if (inexistentProducts.length === 0) return true;

		const newData: Partial<IOrder> = {
			products: order.products.filter(prod => !inexistentProducts.includes(prod.productId as string)),
		};
		await orderFacade.updateOrder(orderId, newData);
		return false;
	}
}

export default new Mercadopago();
