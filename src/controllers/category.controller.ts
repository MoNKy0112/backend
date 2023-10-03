import {type Request, type Response} from 'express';
import CategoryFacade from '../facade/category.facade';

class CategoryController {
	public async createCategory(req: Request, res: Response): Promise<Response | undefined> {
		return CategoryFacade.createCategory(req, res);
	}

	public async getCategories(req: Request, res: Response): Promise<Response | undefined> {
		return CategoryFacade.getCategories(req, res);
	}

	public async getCategoryById(req: Request, res: Response): Promise<Response | undefined> {
		return CategoryFacade.getCategoryById(req, res);
	}

	public async updateCategory(req: Request, res: Response): Promise<Response | undefined> {
		return CategoryFacade.updateCategory(req, res);
	}

	public async deleteCategory(req: Request, res: Response): Promise<Response | undefined> {
		return CategoryFacade.deleteCategory(req, res);
	}
}

export default new CategoryController();
