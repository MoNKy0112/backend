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

	// Async getOrdersByFilters(filters: IOrderFilters): Promise<IOrder[]> {
	// 	try {
	// 		const orders = await Order.find(filters as FilterQuery<IOrder>);
	// 		return orders;
	// 	} catch (error) {
	// 		throw new Error('Error al obtener órdenes con filtros');
	// 	}
	// }

	async getFilteredOrders(userId: ObjectId | string, userType: string, filters: OrderFilters = {}) {
		try {
			let query: QueryOptions<OrderFilters> = {};

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
