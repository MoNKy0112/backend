import {type Request, type Response} from 'express';
import ProductFacade, {InterfaceProductFilters} from '../facades/product.facade';
import moment from 'moment-timezone';

moment.tz.setDefault('America/Bogota');

export const createProduct = async (req: Request, res: Response) => {
	try {
		const productData = req.body;
		console.log(productData);
		productData.createdat = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));
		productData.updatedat = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));
		const savedProduct = await ProductFacade.createProduct(productData); // Llama a la fachada para crear el producto
		return res.status(201).json(savedProduct);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al crear el producto'});
	}
};

export const getProducts = async (req: Request, res: Response) => {
	try {
		const products = await ProductFacade.getProducts(); // Llama a la fachada para obtener los productos
		return res.status(200).json(products);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al obtener los productos'});
	}
};

export const getProductById = async (req: Request, res: Response) => {
	try {
		const {productId} = req.params;
		const product = await ProductFacade.getProductById(productId); // Llama a la fachada para obtener el producto por ID

		if (!product) {
			return res.status(404).json({error: 'Producto no encontrado'});
		}

		return res.status(200).json(product);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al obtener el producto'});
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const {productId} = req.params;
		const productData = req.body;
		productData.updatedat = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000));
		const updatedProduct = await ProductFacade.updateProduct(productId, productData); // Llama a la fachada para actualizar el producto
		if (!updatedProduct) {
			return res.status(404).json({error: 'Producto no encontrado'});
		}

		return res.json(updatedProduct);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al actualizar el producto'});
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const {productId} = req.params;
		const deletedProduct = await ProductFacade.deleteProduct(productId); // Llama a la fachada para eliminar el producto

		if (!deletedProduct) {
			return res.status(404).json({error: 'Producto no encontrado'});
		}

		return res.json({message: 'Producto eliminado exitosamente'});
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al eliminar el producto'});
	}
};
