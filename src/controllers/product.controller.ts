import {type Request, type Response} from 'express';
import ProductFacade from '../facades/product.facade';

class ProductController {
	public async createProduct(req: Request, res: Response): Promise<Response | undefined> {
		return ProductFacade.createProduct(req, res);
	}

	public async getProducts(req: Request, res: Response): Promise<Response | undefined> {
		return ProductFacade.getProducts(req, res);
	}

	public async getProductById(req: Request, res: Response): Promise<Response | undefined> {
		return ProductFacade.getProductById(req, res);
	}

	public async updateProduct(req: Request, res: Response): Promise<Response | undefined> {
		return ProductFacade.updateProduct(req, res);
	}

	public async deleteProduct(req: Request, res: Response): Promise<Response | undefined> {
		return ProductFacade.deleteProduct(req, res);
	}
}

export default new ProductController();
