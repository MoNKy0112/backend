import {type ObjectId, Types, type UpdateQuery} from 'mongoose';
import orderFacade, {type InterfaceOrderFilters} from '../facades/order.facade';
import {type Request, type Response} from 'express';
import Product from '../models/Product';
import {type IOrder} from '../models/Order';
import authFacade from '../facades/auth.facade';

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

		for (const product of req.body.verifiedProducts) {
			console.log('aqui', product.stock);
			await Product.findByIdAndUpdate(product.productId, {$inc: {stock: -product.quantity}});
		}

		const orderData: IOrder = {
			userId: req.userId,
			sellerId: req.body.sellerId as string,
			products: req.body.verifiedProducts as Array<{
				productId: string;
				quantity: number;
				subtotal: number;
			}>,
			totalAmount: req.body.totalAmount as number,
			status: 'inProccess' as string,
			date: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
		};
		const newOrder = await orderFacade.createOrder(orderData);
		res.status(201).json(newOrder);
	} catch (error) {
		if (error instanceof Error) {
			console.error('error trying to create a new order:', error.message);
			res.status(400).json(error);
		} else {
			console.error('Unknown error trying to create a new order:', error);
			res.status(500).json('Unknown error trying to create a new order');
		}
	}
};

export const getOrderById = async (req: Request, res: Response) => {
	// TODO: A middleware would be needed to allow access only to the seller or the buyer
	try {
		const order = await orderFacade.getOrderById(req.params.orderId);
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
			userId: new Types.ObjectId(req.query.userId as string),
			sellerId: new Types.ObjectId(req.query.sellerId as string),
			status: req.query.status as string,
			includeProducts: req.query.includeProducts as string[],
			excludeProducts: req.query.excludeProducts as string[],
			startDate: req.query.startDate as string,
			startDateOperator: req.query.startDateOperator as string,
		}; // Objeto para almacenar los filtros
		console.log(req.query);

		const orders = await orderFacade.getFilteredOrders(req.userId, req.query.userType as string, filters);
		res.json(orders);
	} catch (error) {
		if (error instanceof Error) {
			console.error('error trying to obtain an order:', error.message);
			res.status(400).json(error.message);
		} else {
			console.error('Unknown error trying to obtain an order:', error);
			res.status(500).json('Unknown error trying to obtain an order');
		}
	}
};

export const updateOrder = async (req: Request, res: Response) => {
	try {
		const orderData: UpdateQuery<IOrder> = {
			products: req.body.verifiedProducts as Array<{
				productId: Types.ObjectId;
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
			console.error('error trying to update an order:', error.message);
			res.status(400).json(error.message);
		} else {
			console.error('Unknown error trying to update an order:', error);
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
			console.error('error trying to delete an order:', error.message);
			res.status(400).json(error.message);
		} else {
			console.error('Unknown error trying to delete an order:', error);
			res.status(500).json('Unknown error trying to delete an order');
		}
	}
};
