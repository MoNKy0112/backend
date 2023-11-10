import User, {type IUser} from '../models/User';
import {type UpdateQuery, type ObjectId} from 'mongoose';
import productFacade from './product.facade';
import {canAddToCart} from '../utilities/cart';

class UserFacade {
	public async getUsers(): Promise<IUser[]> {
		try {
			const users = await User.find();
			if (!users) throw new Error('usuarios no encontrados');
			return users;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Error trying to get users');
			}
		}
	}

	public async getUserById(userId: ObjectId | string): Promise<IUser> {
		try {
			const user = await User.findById(userId);
			if (!user) throw new Error('usuario no encontrado');
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to get the user');
			}
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

	public async emptyCart(userId: ObjectId | string) {
		try {
			const updateData: Partial<IUser> = {
				cart: [],
			};
			const user = await User.findByIdAndUpdate(userId, updateData, {new: true});
			if (!user) throw new Error('error al eliminar carrito');
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('error al eliminar carrito');
			}
		}
	}

	public async addToCart(userId: ObjectId | string, productId: string | ObjectId, quantity: number) {
		try {
			if (!quantity)quantity = 1;
			const user = await this.getUserById(userId);
			const product = await productFacade.getProductById(productId);
			// Verifica si el vendedor ya existe en el carrito del usuario
			const existingCart = user.cart.find(cartEntry => String(cartEntry.sellerId) === String(product.sellerId));
			if (existingCart) {
				// Si el vendedor ya existe, actualiza el producto o agrégalo si no existe
				const existingProduct = existingCart.products.find(productCart => String(productCart.productId) === String(product));

				if (existingProduct) {
					if (canAddToCart(product.stock, existingProduct.quantity, quantity)) {
						// Verifica que haya stock adicional
						existingProduct.quantity += quantity;
						existingProduct.subtotal += quantity * product.price; // Asegúrate de obtener el precio del producto
					} else {
						throw new Error('There is not enough stock');
					}
				} else if (canAddToCart(product.stock, 0, quantity)) {
					// Verifica que haya stock
					existingCart.products.push({
						productId: product.id as ObjectId,
						productImageUrl: product.imageUrl,
						productName: product.name,
						quantity,
						subtotal: quantity * product.price,
					});
				} else {
					throw new Error('There is not enough stock');
				}
			} else if (canAddToCart(product.stock, 0, quantity)) {
				// Si el vendedor no existe, crea una nueva entrada de carrito y verifica que haya stock
				user.cart.push({
					sellerId: product.sellerId,
					products: [
						{
							productId: product.id as ObjectId,
							productImageUrl: product.imageUrl,
							productName: product.name,
							quantity,
							subtotal: quantity * product.price,
						},
					],
				});
			} else {
				throw new Error('There is not enough stock');
			}

			await user.save();

			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error when trying to add a product to the cart');
			}
		}
	}

	public async removeOfCart(userId: ObjectId | string, productId: ObjectId | string, quantity?: number) {
		try {
			const user = await this.getUserById(userId);
			const product = await productFacade.getProductById(productId);

			// Encuentra el vendedor en el carrito del usuario
			const cartEntry = user.cart.find(cartEntry => String(cartEntry.sellerId) === String(product.sellerId));
			// Console.log(user.cart[1].sellerId.toString() === product.sellerId.toString());
			if (cartEntry) {
				// Encuentra el producto en el carrito del vendedor
				const productIndex = cartEntry.products.findIndex(productCart => String(productCart.productId) === String(product.id));
				// Si existe el parametro cantidad y es menor a la cantidad existente, remueve solo dicha cantidad
				if (quantity && quantity < cartEntry.products[productIndex].quantity) {
					cartEntry.products[productIndex].quantity -= quantity;
					cartEntry.products[productIndex].subtotal -= quantity * product.price;

					await user.save();
					return user;
				}

				// Si no existe el parametro cantidad o es mayor a la cantidad existente, elimina del carrito el producto
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

			throw new Error('product not found in the cart');
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error when trying to remove a product from the cart');
			}
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
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error by adding favorite products');
			}
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
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error when trying to remove favorite products');
			}
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
			if (error instanceof Error) {
				throw error;
			} else {
				console.log('error:', error);
				throw new Error('Unknown error when trying to add favorite categories');
			}
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
				throw new Error('User not found'); // Lanzar un error si no se encuentra el usuario
			}

			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error trying to delete a favorite category');
			}
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
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error trying to delete user');
			}
		}
	}
}

export default new UserFacade();

