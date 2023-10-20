import {type Request, type Response} from 'express';
import UserFacade from '../facades/user.facade';
import {type IUser} from 'models/User';

class UserController {
	public async getUsers(req: Request, res: Response): Promise<void> {
		console.log('users');
		try {
			const users = await UserFacade.getUsers();
			res.status(200).json(users);
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).json(error.message);
			} else {
				res.status(500).json('Unknown error trying to get users');
			}
		}
	}

	public async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const cedulaToUpdate = req.params.cedula;
			const {name, lastname, phoneNumber} = req.body as IUser;
			const updatedUserFields = {
				name,
				lastname,
				phoneNumber,
			};

			const updatedUser = await UserFacade.updateUser(cedulaToUpdate, updatedUserFields);

			res.status(200).json(updatedUser);
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).json(error.message);
			} else {
				res.status(500).json('Unknown error trying to update user');
			}
		}
	}

	public async addToCart(req: Request, res: Response): Promise<void> {
		try {
			const {userId} = req;
			const productId = req.body.product as string;
			const quantity = req.body.quantity as number; // Obtén la cantidad desde el cuerpo de la solicitud
			const user = await UserFacade.addToCart(userId, productId, quantity);
			res.json(user).status(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error trying to add products in cart:', error.message);
				res.status(400).json(error.message);
			} else {
				console.error('Unknown error trying to add products in cart:', error);
				res.status(500).json('Unknown error trying to add products in cart');
			}
		}
	}

	public async removeOfCart(req: Request, res: Response): Promise<void> {
		try {
			const {userId} = req;
			const product = req.body.products as string;
			const user = await UserFacade.removeOfCart(userId, product);

			res.json(user).status(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error trying to remove products of cart:', error.message);
				res.status(400).json(error.message);
			} else {
				console.error('Unknown error trying to remove products of cart:', error);
				res.status(500).json('Unknown error trying to remove products of cart');
			}
		}
	}

	public async addFavoriteProducts(req: Request, res: Response): Promise<void> {
		try {
			const {userId} = req;
			if (!userId) console.log('no userId');
			const products = req.body.products as string[];
			const user = await UserFacade.addFavoriteProducts(userId, products);
			res.status(200).json(user);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error trying to add favorite products:');
				res.status(400).json(error.message);
			} else {
				console.error('Unknown error trying to add favorite products:');
				res.status(500).json('Unknown error trying to add favorite products');
			}
		}
	}

	public async removeFavoriteProducts(req: Request, res: Response): Promise<void> {
		try {
			const {userId} = req;
			const products = req.body.products as string[];
			const user = await UserFacade.removeFavoriteProducts(userId, products);

			res.json(user).status(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error trying to remove favorite products:', error.message);
				res.status(400).json(error.message);
			} else {
				console.error('Unknown error trying to remove favorite products:', error);
				res.status(500).json('Unknown error trying to remove favorite products');
			}
		}
	}

	public async addFavoriteCategories(req: Request, res: Response): Promise<void> {
		try {
			const {userId} = req;
			const categories = req.body.categories as string[];
			const user = await UserFacade.addFavoriteCategories(userId, categories);

			res.json(user).status(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error trying to add favorite categories:', error.message);
				res.status(400).json(error.message);
			} else {
				console.error('Unknown error trying to add favorite categories:', error);
				res.status(500).json('Unknown error trying to add favorite categories');
			}
		}
	}

	public async removeFavoriteCategories(req: Request, res: Response): Promise<void> {
		try {
			const {userId} = req;
			const categories = req.body.categories as string[];
			const user = await UserFacade.removeFavoriteCategories(userId, categories);

			res.json(user).status(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error trying to remove favorite categories:', error.message);
				res.status(400).json(error.message);
			} else {
				console.error('Unknown error trying to remove favorite categories:', error);
				res.status(500).json('Unknown error trying to remove favorite categories');
			}
		}
	}

	public async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const cedulaToUpdate = req.params.cedula;
			const user = await UserFacade.deleteUser(cedulaToUpdate);
			res.status(200).json(user);
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).json(error.message);
			} else {
				res.status(500).json('Unknown error trying to delete user');
			}
		}
	}
}

export default new UserController();
