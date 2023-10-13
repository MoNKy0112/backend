import {type Request, type Response} from 'express';
import UserFacade from '../facades/user.facade';
import {type IUser} from 'models/User';

class UserController {
	public async getUsers(req: Request, res: Response): Promise<Response | undefined> {
		return UserFacade.getUsers(req, res);
	}

	public async updateUser(req: Request, res: Response): Promise<Response | undefined> {
		return UserFacade.updateUser(req, res);
	}

	public async addToCart(req: Request, res: Response) {
		try {
			const {userId} = req;
			const products = req.body.products as string[];
			const user = UserFacade.addToCart(userId, products);

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

	public async removeOfCart(req: Request, res: Response) {
		try {
			const {userId} = req;
			const products = req.body.products as string[];
			const user = UserFacade.removeOfCart(userId, products);

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

	public async addFavoriteProducts(req: Request, res: Response) {
		try {
			const {userId} = req;
			const products = req.body.products as string[];
			const user = UserFacade.addFavoriteProducts(userId, products);

			res.json(user).status(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error trying to add favorite products:', error.message);
				res.status(400).json(error.message);
			} else {
				console.error('Unknown error trying to add favorite products:', error);
				res.status(500).json('Unknown error trying to add favorite products');
			}
		}
	}

	public async removeFavoriteProducts(req: Request, res: Response) {
		try {
			const {userId} = req;
			const products = req.body.products as string[];
			const user = UserFacade.removeFavoriteProducts(userId, products);

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

	public async addFavoriteCategories(req: Request, res: Response) {
		try {
			const {userId} = req;
			const categories = req.body.categories as string[];
			const user = UserFacade.addFavoriteCategories(userId, categories);

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

	public async removeFavoriteCategories(req: Request, res: Response) {
		try {
			const {userId} = req;
			const categories = req.body.categories as string[];
			const user = UserFacade.removeFavoriteCategories(userId, categories);

			res.json(user).status(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error trying to remove favorite categories:', error.message);
				res.status(400).json(error.message);
			} else {
				console.error('Unknown error trying to remove favorite categories:', error);
				res.status(500).json('Unknown error trying to remove favorite categories');
			}
		}
	}

	public async deleteUser(req: Request, res: Response): Promise<Response | undefined> {
		return UserFacade.deleteUser(req, res);
	}
}

export default new UserController();
