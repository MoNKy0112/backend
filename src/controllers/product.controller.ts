import {type Request, type Response} from 'express';
import ProductFacade, {type InterfaceProductFilters} from '../facades/product.facade';
import moment from 'moment-timezone';
import {type IProduct} from 'models/Product';
import {Date, type UpdateQuery} from 'mongoose';
import User from '../models/User';

moment.tz.setDefault('America/Bogota');

export const test = async (req: Request, res: Response) => {
	try {
		const a = await User.find({favoriteProducts: {$in: [req.body.id as string]}});
		res.json(a);
	} catch (error) {
		res.json(error);
	}
};

export const createProduct = async (req: Request, res: Response) => {
	try {
		const productData: IProduct = {
			name: req.body.name as string,
			sellerId: req.userId,
			categories: req.body.categories as string[],
			description: req.body.description as string,
			price: req.body.price as number,
			imageUrl: req.body.imageUrl as string,
			stock: req.body.stock as number,
			discount: req.body.discount as number,
			solds: 0,
			createdat: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
			updatedat: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
		};
		console.log(productData);
		console.log(productData.sellerId);
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

export const getProductsBySeller = async (req: Request, res: Response) => {
	try {
		const sellerId = req.userId;
		const products = await ProductFacade.getProductsBySeller(sellerId); // Llama a la fachada para obtener los productos por ID del vendedor

		if (!products) {
			return res.status(404).json({error: 'Productos no encontrados'});
		}

		return res.status(200).json(products);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al obtener los productos'});
	}
};

export const getProductsByFilters = async (req: Request, res: Response) => {
	try {
		const filters: InterfaceProductFilters = req.query;
		const products = await ProductFacade.getProductsByFilters(filters); // Llama a la fachada para obtener los productos por filtros
		console.log(req.query);
		return res.status(200).json(products);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al obtener los productos'});
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const {productId} = req.params;
		const productData: Partial<IProduct> = {
			name: req.body.name as string,
			categories: req.body.categories as string[],
			description: req.body.description as string,
			price: req.body.price as number,
			imageUrl: req.body.imageUrl as string,
			stock: req.body.stock as number,
			discount: req.body.discount as number,

			updatedat: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
		};
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

		res.json({message: 'Producto eliminado exitosamente'});
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			res.status(400).json(error.message);
		} else {
			res.status(500).json({error});
		}
	}
};
