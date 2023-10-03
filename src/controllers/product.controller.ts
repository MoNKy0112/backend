import {type Request, type Response} from 'express';
import ProductModel, {type IProduct} from '../models/Product';
import productFacade from '../facades/product.facade';

class productController {
	public async createProduct(req: Request, res: Response): Promise<Response | undefined> {
		return productFacade.createProduct(req, res);
	}

	public async getProducts(req: Request, res: Response): Promise<Response | undefined> {
		return productFacade.getProducts(req, res);
	}

	public async getProductById(req: Request, res: Response): Promise<Response | undefined> {
		return productFacade.getProductById(req, res);
	}

	public async updateProduct(req: Request, res: Response): Promise<Response | undefined> {
		return productFacade.updateProduct(req, res);
	}

	public async deleteProduct(req: Request, res: Response): Promise<Response | undefined> {
		return productFacade.deleteProduct(req, res);
	}
}

export default new productController();
