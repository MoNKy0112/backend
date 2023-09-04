import {type Types, type ObjectId, type FilterQuery, type UpdateQuery} from 'mongoose';
import Order, {type IOrder} from '../models/Order';

export type IOrderFilters = {
	userId?: Types.ObjectId;
	sellerId?: Types.ObjectId;
	status?: string;

	'products.productId'?: {$all: Types.ObjectId[]};
	// ...otros filtros...
};
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
				return savedOrder;
			} catch (error) {
				throw new Error();
			}
		} catch (error) {
			throw new Error('Error al crear la orden');
		}
	}

	async getOrderById(orderId: ObjectId | string) {
		try {
			const order = await Order.findById(orderId);
			return order;
		} catch (error) {
			throw new Error('Error al obtener la orden por ID');
		}
	}

	async getOrdersByFilters(filters: IOrderFilters): Promise<IOrder[]> {
		try {
			const orders = await Order.find(filters as FilterQuery<IOrder>);
			return orders;
		} catch (error) {
			throw new Error('Error al obtener órdenes con filtros');
		}
	}

	public async updateOrder(orderId: ObjectId | string, newData: UpdateQuery<IOrder>) {
		try {
			const order = await Order.findByIdAndUpdate(orderId, newData, {new: true});
			return order;
		} catch (error) {
			throw new Error('Error al actualizar la orden');
		}
	}

	public async deleteOrder(orderId: ObjectId | string) {
		try {
			const deletedOrder = await Order.findByIdAndDelete(orderId);
			return deletedOrder;
		} catch (error) {
			throw new Error('Error al eliminar la orden');
		}
	}

	public async getProducts(orderId: ObjectId | string) {
		try {
			const order = await Order.findById(orderId);
			if (!order) throw new Error('Orden no encontrada');
			const products = order?.products;
			return products;
		} catch (error) {
			throw new Error('Error al obtener los productos de la orden');
		}
	}
}

export default new OrderFacade();
