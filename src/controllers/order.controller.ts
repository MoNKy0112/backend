import {type ObjectId, Types, type UpdateQuery} from 'mongoose';
import orderFacade, {type IOrderFilters} from '../facades/order.facade';
import {type Request, type Response} from 'express';
import User from '../models/User';
import Product from '../models/Product';
import {type IOrder} from 'models/Order';

export const createNewOrder = async (req: Request, res: Response) => {
	try {
		// Manejo de errores de Ids
		// TODO: 'crear middlewares para verificar cada objeto'
		const user = await User.findById(req.body.userId);
		if (!user) return res.status(400).json('User not exists');
		const seller = await User.findById(req.body.sellerId);
		if (!seller) return res.status(400).json('Seller not exists');
		for (const product of req.body.verifiedProducts) {
			await Product.findByIdAndUpdate(product.productId, {$inc: {stock: -product.quantity}});
		}

		const orderData = {
			userId: user._id as Types.ObjectId,
			sellerId: seller._id as Types.ObjectId,
			products: req.body.verifiedProducts as Array<{
				productId: Types.ObjectId;
				quantity: number;
				subtotal: number;
			}>,
			totalAmount: req.body.totalAmount as number,
			status: 'inProccess' as string,
		};
		const newOrder = await orderFacade.createOrder(orderData);
		res.status(201).json(newOrder);
	} catch (error) {
		res.status(500).json({error: 'Error al crear la orden'});
	}
};

export const getOrderById = async (req: Request, res: Response) => {
	// TODO: A middleware would be needed to allow access only to the seller or the buyer
	try {
		const order = await orderFacade.getOrderById(req.params.orderId);
		res.json(order);
	} catch (error) {
		res.status(500).json('Error al obtener la orden');
	}
};

export const getOrders = async (req: Request, res: Response) => {
	try {
		const filters: IOrderFilters = {}; // Objeto para almacenar los filtros
		console.log(req.query);
		// Agrega los filtros que necesites, por ejemplo:
		if (req.query.userId) {
			const userId = req.query.userId as string;
			filters.userId = new Types.ObjectId(userId);
		}

		if (req.query.sellerId) {
			const sellerId = req.query.sellerId as string;
			filters.sellerId = new Types.ObjectId(sellerId);
		}

		if (req.query.status) {
			filters.status = req.query.status as string;
		}

		if (req.query.products) {
			if (typeof req.query.products === 'string') {
				const productIds = [new Types.ObjectId(req.query.products)];
				filters['products.productId'] = {$all: productIds};
			} else {
				const productsArray = req.query.products as string[];
				const productIds = productsArray.map(productId => new Types.ObjectId(productId));
				filters['products.productId'] = {$all: productIds};
			}
		}

		const orders = await orderFacade.getOrdersByFilters(filters);
		res.json(orders);
	} catch (error) {
		res.status(500).json({error: 'Error al obtener órdenes con filtros'});
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
		res.status(500).json(error);
	}
};

export const deleteOrder = async (req: Request, res: Response) => {
	try {
		const orderDeleted = await orderFacade.deleteOrder(req.params.orderId as ObjectId | string);
		res.status(201).json(orderDeleted);
	} catch (error) {
		res.status(500).json(error);
	}
};
