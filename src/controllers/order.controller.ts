import {type Schema, type ObjectId} from 'mongoose';
import orderFacade from '../facades/order.facade';
import {type Request, type Response} from 'express';
import {type IOrder} from 'models/Order';
import User from '../models/User';
import Product from '../models/Product';
import {stringify} from 'querystring';

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
			userId: user._id as Schema.Types.ObjectId,
			sellerId: seller._id as Schema.Types.ObjectId,
			products: req.body.verifiedProducts as Array<{
				productId: Schema.Types.ObjectId;
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

