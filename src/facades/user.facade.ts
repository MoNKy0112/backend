import {type Request, type Response} from 'express';
import User, {type IUser} from '../models/User';
import {type ObjectId} from 'mongoose';

class UserFacade {
	public async getUsers(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const users = await User.find();
			return res.status(200).json(users);
		} catch (error) {
			console.error('Error obteniendo los usuarios:', error);
			res.status(500).json({error: 'Error interno del servidor'});
		}
	}

	public async updateUser(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const cedulaToUpdate = req.params.cedula;
			const {name, lastname, phoneNumber} = req.body as IUser;
			const updatedUserFields = {
				name,
				lastname,
				phoneNumber,
			};

			const updatedUser = await User.findOneAndUpdate(
				{id_cedula: cedulaToUpdate},
				updatedUserFields,
				{new: true},
			);

			if (!updatedUser) {
				return res.status(404).json({error: 'Usuario no encontrado'});
			}

			res.json(updatedUser);
		} catch (error) {
			res.status(500).json({error: 'Error al actualizar el usuario'});
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

	public async deleteUser(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const cedulaToDelete = req.params.cedula;
			const deletedUser = await User.findOneAndDelete({
				id_cedula: cedulaToDelete,
			});
			if (!deletedUser) {
				return res.status(404).json({error: 'Usuario no encontrado'});
			}

			res.json({message: 'Usuario eliminado exitosamente'});
		} catch (error) {
			res.status(500).json({error: 'Error al eliminar el usuario'});
		}
	}
}

export default new UserFacade();
