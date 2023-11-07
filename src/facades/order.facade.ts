import {type Types, type ObjectId, type UpdateQuery} from 'mongoose';
import Order, {type IOrder} from '../models/Order';
import {type QueryOptions} from 'mongoose';

// Export type IOrderFilters = {
// 	userId?: Types.ObjectId;
// 	sellerId?: Types.ObjectId;
// 	status?: string;

// 	'products.productId'?: {$all: Types.ObjectId[]};
// 	// ...otros filtros...
// };

export type InterfaceOrderFilters = {
	userId?: Types.ObjectId;
	sellerId?: Types.ObjectId;
	status?: string;
	includeProducts?: string[]; // Lista de IDs de productos a incluir
	excludeProducts?: string[]; // Lista de IDs de productos a excluir
	startDate?: string; // Fecha de inicio
	startDateOperator?: string; // Operador de fecha (opcional)
	orderStatus?: string[] ; // Lista de estados de orden
};
class OrderFacade {
	async createOrder(order: IOrder): Promise<IOrder> {
		try {
			const newOrder = new Order(order);
			if (!newOrder) throw new Error('Error trying to create order');
			const savedOrder = await newOrder.save();
			if (!savedOrder) throw new Error('Error trying to keep order');
			return savedOrder;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to create the order');
			}
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

	// Async getOrdersByFilters(filters: IOrderFilters): Promise<IOrder[]> {
	// 	try {
	// 		const orders = await Order.find(filters as FilterQuery<IOrder>);
	// 		return orders;
	// 	} catch (error) {
	// 		throw new Error('Error al obtener órdenes con filtros');
	// 	}
	// }

	async getFilteredOrders(userId: ObjectId | string, userType: string, filters: InterfaceOrderFilters = {}) {
		try {
			let query: QueryOptions<InterfaceOrderFilters> = {};

			if (userType === 'Seller') {
				query = {sellerId: userId};
			} else if (userType === 'Buyer') {
				query = {userId};
			}

			// Filtro de productos específicos o excluyentes.
			if (filters.includeProducts && filters.includeProducts.length > 0) {
				query.productIds = {$in: filters.includeProducts};
			}

			if (filters.excludeProducts && filters.excludeProducts.length > 0) {
				query.productIds = {$nin: filters.excludeProducts};
			}

			// Filtro de fechas (mayor, menor o igual).
			if (filters.startDate) {
				const dateOperator = filters.startDateOperator ?? '$eq';
				query.orderDate = {[dateOperator]: filters.startDate};
			}

			// Filtro por estado de la orden.
			if (filters.orderStatus && filters.orderStatus.length > 0) {
				query.status = {$in: filters.orderStatus};
			}

			const pipeline = [
				{
					$match: query,
				},
				{
					$project: {
						_id: 1,
						orderDate: 1,
						status: 1,
						productIds: 1,
					},
				},
			];

			// Puedes agregar más etapas al pipeline según las necesidades.

			// Ejecutar la consulta de agregación con el pipeline construido.
			const cursor = Order.aggregate<IOrder>(pipeline);
			const orders = cursor.exec();

			return await orders;
		} catch (error) {
			return error;
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
