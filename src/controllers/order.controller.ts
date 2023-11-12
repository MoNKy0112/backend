import {type ObjectId, type Schema} from 'mongoose';
import orderFacade, {type InterfaceOrderFilters} from '../facades/order.facade';
import {type Request, type Response} from 'express';
import {type IOrder} from '../models/Order';
import authFacade from '../facades/auth.facade';
import productFacade from '../facades/product.facade';
import userFacade from '../facades/user.facade';

export const createNewOrder = async (req: Request, res: Response) => {
	try {
		// Manejo de errores de Ids
		// TODO: 'crear middlewares para verificar cada objeto'
		// const user = await User.findById(req.body.userId);
		// if (!user) return res.status(400).json('User not exists');
		// const seller = await User.findById(req.body.sellerId);
		// if (!seller) return res.status(400).json('Seller not exists');
		const user = await authFacade.getuser(req.userId);
		if (!user) throw new Error('error');
		const allProducts: Array<{productId: string | Schema.Types.ObjectId; quantity: number}> = [];
		const orders = user.cart.map(async cart => {
			const {products, sellerId} = cart;
			const productIds = products.map(product => {
				const {productId, quantity} = product;
				return {productId, quantity};
			});
			allProducts.push(...productIds);

			const total = products.reduce((accumulator, cartProduct) => accumulator + cartProduct.subtotal, 0);
			const order: IOrder = {
				userId: user._id as string,
				sellerId,
				products,
				status: '',
				date: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
				totalAmount: total,
				preferenceId: '',
			};
			return order;
		});

		const newOrders = await Promise.all(orders.map(async order => {
			const newOrder = await orderFacade.createOrder(await order);
			return newOrder;
		}));

		const userWhitoutCart = await userFacade.emptyCart(user._id as string);

		await Promise.all(allProducts.map(async product => {
			const updatedProduct = await productFacade.reduceStock(product.productId, product.quantity);
			return updatedProduct;
		}));

		res.status(201).json({newOrders, userWhitoutCart});
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json('Unknown error trying to create a new order');
		}
	}
};

export const getOrderById = async (req: Request, res: Response) => {
	// TODO: A middleware would be needed to allow access only to the seller or the buyer
	try {
		const order = await orderFacade.getOrderById(req.params.orderId);
		// TODO add admin role permissions
		if (String(order.userId) !== req.userId && String(order.sellerId) !== req.userId) throw new Error('unauthorized access to order');
		res.json(order);
	} catch (error) {
		if (error instanceof Error) {
			console.error('error trying to obtain an order by Id:', error.message);
			res.status(400).json(error.message);
		} else {
			console.error('Unknown error trying to obtain an order by Id:', error);
			res.status(500).json('Unknown error trying to obtain an order by Id');
		}
	}
};

export const getOrders = async (req: Request, res: Response) => {
	try {
		// Agrega los filtros que necesites

		const filters: InterfaceOrderFilters = {
			userId: req.query.userId as string,
			sellerId: req.query.sellerId as string,
			orderStatus: req.query.orderStatus as string[],
			includeProducts: req.query.includeProducts as string[],
			excludeProducts: req.query.excludeProducts as string[],
			startDate: req.query.startDate as string,
			startDateOperator: req.query.startDateOperator as string,
		}; // Objeto para almacenar los filtros

		const orders = await orderFacade.getFilteredOrders(req.userId, req.query.userType as string, filters);
		res.json(orders);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error.message);
		} else {
			res.status(500).json('Unknown error trying to obtain an order');
		}
	}
};

export const updateOrder = async (req: Request, res: Response) => {
	try {
		const orderData: Partial<IOrder> = {
			products: req.body.verifiedProducts as Array<{
				productId: Schema.Types.ObjectId | string;
				quantity: number;
				subtotal: number;
			}>,
			totalAmount: req.body.totalAmount as number,
			status: req.body.status as string,
		};

		const newOrder = await orderFacade.updateOrder(req.params.orderId as ObjectId | string, orderData);
		res.status(201).json(newOrder);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error.message);
		} else {
			res.status(500).json('Unknown error trying to update an order');
		}
	}
};

export const deleteOrder = async (req: Request, res: Response) => {
	try {
		const orderDeleted = await orderFacade.deleteOrder(req.params.orderId as ObjectId | string);
		res.status(201).json(orderDeleted);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error.message);
		} else {
			res.status(500).json('Unknown error trying to delete an order');
		}
	}
};
