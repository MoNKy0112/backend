import User, {type IUser} from '../models/User';
import {type UpdateQuery, type ObjectId} from 'mongoose';

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

	public async addToCart(userId: ObjectId | string, products: ObjectId[] | string[]) {

	}

	public async removeOfCart(userId: ObjectId | string, products: ObjectId[] | string[]) {

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
