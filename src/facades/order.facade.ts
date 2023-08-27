import {type Types, type ObjectId, type FilterQuery} from 'mongoose';
import Order, {type IOrder} from '../models/Order';

class OrderFacade {
	async createOrder(data: any): Promise<IOrder> {
		try {
			const order: IOrder = new Order({
				userId: data.userId as ObjectId,
				sellerId: data.sellerId as ObjectId,
				products: data.products as Array<{
					productId: ObjectId;
					quantity: number;
					subtotal: number;
				}>,
				totalAmount: data.totalAmount as number,
				status: data.status as string,
			});
			try {
				const savedOrder = await order.save();
				console.log(savedOrder);
				return savedOrder;
			} catch (error) {
				console.log(error);
				throw new Error();
			}
		} catch (error) {
			throw new Error('Error al crear la orden');
		}
	}

	async getOrderById(orderId: ObjectId | string) {
		const order = await Order.findById(orderId);
		return order;
	}

	async getOrdersByBuyer(userId: ObjectId | string) {
		const orders = await Order.find({userId});
		return orders;
	}

	async getOrdersByFilters(filters: Partial<IOrder>): Promise<IOrder[]> {
		try {
			const orders = await Order.find(filters as FilterQuery<IOrder>); // Utiliza los filtros proporcionados
			return orders;
		} catch (error) {
			throw new Error('Error al obtener órdenes con filtros');
		}
	}

	public async updateOrder(orderId: ObjectId | string, newData: Document) {
		const order = Order.findByIdAndUpdate(orderId, newData, {new: true});
		return order;
	}

	public async deleteOrder(orderId: ObjectId | string) {
		const deletedOrder = await Order.findByIdAndDelete(orderId);
		return deletedOrder;
	}

	public async getProducts(orderId: ObjectId | string) {
		const order = await Order.findById(orderId);
		if (!order) throw new Error('Orden no encontrada');
		const products = order?.products;
		return products;
	}
}

export default new OrderFacade();
