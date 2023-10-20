import User, {type IUser} from '../models/User';
import {type UpdateQuery, type ObjectId} from 'mongoose';
import productFacade from './product.facade';

class UserFacade {
	public async getUsers(): Promise<IUser[]> {
		try {
			const users = await User.find();
			return users;
		} catch (error) {
			console.error('Error obteniendo los usuarios:', error);
			throw new Error('Error al obtener usuarios');
			// Res.status(500).json({error: 'Error interno del servidor'});
		}
	}

	public async getUserById(userId: ObjectId | string): Promise<IUser> {
		try {
			const user = await User.findById(userId);
			if (!user) throw new Error('usuario no encontrado');
			return user;
		} catch (error) {
			console.error('Error obteniendo al usuario:', error);
			throw new Error('Error obteniendo al usuario');
			// Res.status(500).json({error: 'Error interno del servidor'});
		}
	}

	public async updateUser(cedulaToUpdate: string, updatedUserFields: UpdateQuery<IUser>): Promise<IUser> {
		try {
			const updatedUser = await User.findOneAndUpdate(
				{id_cedula: cedulaToUpdate},
				updatedUserFields,
				{new: true},
			);

			if (!updatedUser) {
				throw new Error('User not found');
			}

			return updatedUser;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error(`Error trying to update user with id_cedula ${cedulaToUpdate}`);
			}
		}
	}

	public async addToCart(userId: ObjectId | string, productId: ObjectId | string, quantity: number) {
		try {
			const user = await this.getUserById(userId);
			const product = await productFacade.getProductById(productId);
			// Verifica si el vendedor ya existe en el carrito del usuario
			const existingCart = user.cart.find(cartEntry => cartEntry.sellerId === product.sellerId);

			if (existingCart) {
				// Si el vendedor ya existe, actualiza el producto o agrégalo si no existe
				const existingProduct = existingCart.products.find(productCart => productCart.productId === product.id);

				if (existingProduct) {
					existingProduct.quantity += quantity;
					existingProduct.subtotal += quantity * product.price; // Asegúrate de obtener el precio del producto
				} else {
					existingCart.products.push({
						productId,
						quantity,
						subtotal: quantity * product.price,
					});
				}
			} else {
				// Si el vendedor no existe, crea una nueva entrada de carrito
				user.cart.push({
					sellerId: productId,
					products: [
						{
							productId,
							quantity,
							subtotal: quantity * product.price,
						},
					],
				});
			}

			await user.save();

			return user;
		} catch (error) {
			console.error(error);
			throw new Error('Error al agregar productos favoritos');
		}
	}

	public async removeOfCart(userId: ObjectId | string, productId: ObjectId | string) {
		try {
			const user = await this.getUserById(userId);
			const product = await productFacade.getProductById(productId);

			// Encuentra el vendedor en el carrito del usuario
			const cartEntry = user.cart.find(cartEntry => cartEntry.sellerId === product.sellerId);

			if (cartEntry) {
				// Encuentra el producto en el carrito del vendedor
				const productIndex = cartEntry.products.findIndex(productCart => productCart.productId === product.id);

				if (productIndex !== -1) {
					// Elimina el producto del carrito del vendedor
					cartEntry.products.splice(productIndex, 1);

					// Si el carrito del vendedor está vacío, elimina la entrada del vendedor
					if (cartEntry.products.length === 0) {
						const cartIndex = user.cart.indexOf(cartEntry);
						// eslint-disable-next-line max-depth
						if (cartIndex !== -1) {
							user.cart.splice(cartIndex, 1);
						}
					}

					await user.save();
					return user;
				}
			}

			throw new Error('producto no encontrado en el carrito');
		} catch (error) {
			console.error(error);
			throw new Error('Error desconocido al intentar eliminar un producto del carrito');
		}
	}

	public async addFavoriteProducts(userId: ObjectId | string, products: ObjectId[] | string[]) {
		try {
			const user = await User.findByIdAndUpdate(
				userId,
				{$addToSet: {favouriteProducts: {$each: products}}},
				{new: true},
			);

			if (!user) {
				throw new Error('Usuario no encontrado'); // Lanzar un error si no se encuentra el usuario
			}

			// Console.log(user);
			return user;
		} catch (error) {
			throw new Error('Error al agregar productos favoritos');
		}
	}

	public async removeFavoriteProducts(userId: ObjectId | string, products: ObjectId[] | string[]) {
		try {
			const user = await User.findByIdAndUpdate(
				userId,
				{$pull: {favouriteProducts: {$in: products}}},
				{new: true},
			);

			if (!user) {
				throw new Error('Usuario no encontrado'); // Lanzar un error si no se encuentra el usuario
			}

			return user;
		} catch (error) {
			throw new Error('Error al remover productos favoritos');
		}
	}

	public async addFavoriteCategories(userId: ObjectId | string, categories: ObjectId[] | string[]) {
		try {
			const user = await User.findByIdAndUpdate(
				userId,
				{$addToSet: {favouriteCategories: {$each: categories}}},
				{new: true},
			);

			if (!user) {
				throw new Error('Usuario no encontrado'); // Lanzar un error si no se encuentra el usuario
			}

			return user;
		} catch (error) {
			console.log('error:', error);
			throw new Error('Error al agregar categorias favoritas');
		}
	}

	public async removeFavoriteCategories(userId: ObjectId | string, categories: ObjectId[] | string[]) {
		try {
			const user = await User.findByIdAndUpdate(
				userId,
				{$pull: {favouriteProducts: {$in: categories}}},
				{new: true},
			);

			if (!user) {
				throw new Error('Usuario no encontrado'); // Lanzar un error si no se encuentra el usuario
			}

			return user;
		} catch (error) {
			throw new Error('Error al remover categorias favoritas');
		}
	}

	public async deleteUser(cedulaToDelete: string): Promise<IUser> {
		try {
			const deletedUser = await User.findOneAndDelete({
				id_cedula: cedulaToDelete,
			});
			if (!deletedUser) {
				throw new Error('User not found');
			}

			return deletedUser;
		} catch (error) {
			throw new Error('Error trying to delete user');
		}
	}
}

export default new UserFacade();
