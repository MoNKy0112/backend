import {type Request, type Response} from 'express';
import ProductModel, {type IProduct} from '../models/Product'; // Ajusta la ruta según la ubicación real de tu modelo

export const createProduct = async (req: Request, res: Response) => {
	try {
		const productData: IProduct = req.body as IProduct;
		console.log(productData);
		const newProduct = new ProductModel(productData);
		const savedProduct = await newProduct.save();
		res.status(201).json(savedProduct);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Error al crear el producto'});
	}
};

export const getProducts = async (req: Request, res: Response) => {
	try {
		const products = await ProductModel.find();
		res.status(200).json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Error al obtener los productos'});
	}
};

export const getProductById = async (req: Request, res: Response) => {
	try {
		const {productId} = req.params;
		const product = await ProductModel.findById(productId);
		if (!product) {
			return res.status(404).json({error: 'Producto no encontrado'});
		}

		res.status(200).json(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Error al obtener el producto'});
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const {productId} = req.params;
		const productData: IProduct = req.body as IProduct;
		const updatedProduct = await ProductModel.findByIdAndUpdate(productId, productData, {new: true});
		if (!updatedProduct) {
			return res.status(404).json({error: 'Producto no encontrado'});
		}

		res.status(200).json(updatedProduct);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Error al actualizar el producto'});
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const {productId} = req.params;
		const deletedProduct = await ProductModel.findByIdAndDelete(productId);
		if (!deletedProduct) {
			return res.status(404).json({error: 'Producto no encontrado'});
		}

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Error al eliminar el producto'});
	}
};
