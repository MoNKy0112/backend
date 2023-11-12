import mongoose, {Types, type ObjectId, Mongoose} from 'mongoose';
import Order, {type IOrder} from '../models/Order';
import {type FilterQuery} from 'mongoose';

// Export type IOrderFilters = {
// 	userId?: Types.ObjectId;
// 	sellerId?: Types.ObjectId;
// 	status?: string;

// 	'products.productId'?: {$all: Types.ObjectId[]};
// 	// ...otros filtros...
// };

export type InterfaceOrderFilters = {
	userId?: Types.ObjectId | string;
	sellerId?: Types.ObjectId | string;
	status?: string;
	includeProducts?: Types.ObjectId[] | string[]; // Lista de IDs de productos a incluir
	excludeProducts?: Types.ObjectId[] | string[]; // Lista de IDs de productos a excluir
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
			if (!order) throw new Error('error when trying to obtain an order');
			return order;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Error al obtener la orden por ID');
			}
		}
	}

	async getOrderByPreferenceId(preferenceId: string, status: string) {
		try {
			const order = await Order.findOneAndUpdate({preferenceId}, {status}, {new: true});
			if (!order) throw new Error('error when trying to obtain an order by preference');
			return order;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Error obtaining the order by preference ID');
			}
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
			let query: FilterQuery<IOrder> = {};

			if (userType === 'seller') {
				query = {sellerId: userId};
			} else if (userType === 'buyer') {
				query.userId = (typeof (userId) === 'string') ? new Types.ObjectId(userId) : userId;
			} else {
				throw new Error('userType not declarated');
			}

			// Filtro de productos específicos o excluyentes.
			if (filters.includeProducts) {
				const includeProducts = Array.isArray(filters.includeProducts)
					? filters.includeProducts.map(s => new Types.ObjectId(s)) : [new Types.ObjectId(filters.includeProducts)];
				console.log(includeProducts);
				query['products.productId'] = {
					// $all interseccion
					$all: includeProducts,
					// $in union
					// $in: includeProducts,
					// ProductId: {$in: includeProducts},
				};
			}

			if (filters.excludeProducts) {
				const excludeProducts = Array.isArray(filters.excludeProducts) ? filters.excludeProducts.map(s => new Types.ObjectId(s)) : [new Types.ObjectId(filters.excludeProducts)];
				query.products = {
					$not: {
						$elemMatch: {
							productId: {$in: excludeProducts},
						},
					},
				};
			}

			// Filtro de fechas (mayor, menor o igual).
			if (filters.startDate) {
				const dateOperator = filters.startDateOperator ?? '$eq';
				query.orderDate = {[dateOperator]: filters.startDate};
			}

			// Filtro por estado de la orden.
			if (filters.orderStatus) {
				const status = Array.isArray(filters.orderStatus) ? filters.orderStatus : [filters.orderStatus];
				query.status = {$in: status};
			}

			console.log(query);
			const pipeline = [
				{
					$match: query,
				},
				{
					$project: {
						userId: 1,
						_id: 1,
						date: 1,
						status: 1,
						products: 1,
					},
				},
			];
			console.log(pipeline);
			// Puedes agregar más etapas al pipeline según las necesidades.

			// Ejecutar la consulta de agregación con el pipeline construido.
			const cursor = Order.aggregate(pipeline);
			const orders = await cursor.exec();
			// For (const order of orders) {
			// 	console.log(order.userId);
			// }

			return {orders};
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when obtaining user orders');
			}
		}
	}

	public async updateOrder(orderId: ObjectId | string, newData: Partial<IOrder>) {
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
