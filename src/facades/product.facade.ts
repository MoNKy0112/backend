import {type Request, type Response} from 'express';
import ProductModel, {type IProduct} from '../models/Product';

class ProductFacade {
	public async createProduct(req: Request, res: Response): Promise<Response> {
		try {
			const productData: IProduct = req.body as IProduct;
			const newProduct = new ProductModel(productData);
			const savedProduct = await newProduct.save();
			return res.status(201).json(savedProduct);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al crear el producto'});
		}
	}

	public async getProducts(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const products = await ProductModel.find();
			return res.status(200).json(products);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al obtener los productos'});
		}
	}

	public async getProductById(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const {productId} = req.params;
			const product = await ProductModel.findById(productId);
			if (!product) {
				return res.status(404).json({error: 'Producto no encontrado'});
			}

			return res.status(200).json(product);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al obtener el producto'});
		}
	}

	public async updateProduct(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const {productId} = req.params;
			const productData: IProduct = req.body as IProduct;
			const updatedProduct = await ProductModel.findByIdAndUpdate(productId, productData, {new: true});
			if (!updatedProduct) {
				return res.status(404).json({error: 'Producto no encontrado'});
			}

			return res.json(updatedProduct);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al actualizar el producto'});
		}
	}

	public async deleteProduct(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const {productId} = req.params;
			const deletedProduct = await ProductModel.findByIdAndDelete(productId);
			if (!deletedProduct) {
				return res.status(404).json({error: 'Producto no encontrado'});
			}

			return res.json({message: 'Producto eliminado exitosamente'});
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al eliminar el producto'});
		}
	}
}

export default new ProductFacade();

