import {type ObjectId} from 'mongoose';
import Order, {type IOrder} from '../models/Order';
import {error} from 'console';

class OrderFacade {
	async createOrder(data: ObjectId) {
		const order: IOrder = new Order(data);
		return order;
	}

	async getOrderById(orderId: ObjectId) {
		const order = await Order.findById(orderId);
		return order;
	}

	public async updateOrder(orderId: ObjectId, newData: Document) {
		const order = Order.findByIdAndUpdate(orderId, newData, {new: true});
		return order;
	}

	public async deleteOrder(orderId: ObjectId) {
		const deletedOrder = await Order.findByIdAndDelete(orderId);
		return deletedOrder;
	}

	public async getProducts(orderId: ObjectId) {
		const order = await Order.findById(orderId);
		if (!order) return error;
		const products = order?.products;
		return products;
	}
}

export default new OrderFacade();
