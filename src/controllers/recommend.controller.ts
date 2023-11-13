/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Product from '../models/Product';
import User from '../models/User';
import userController from './user.controller';
import {type Request, type Response} from 'express';

// Controlador para obtener recomendaciones de productos
export const getRecommendations = async (req: Request, res: Response) => {
	try {
		let recommendations;
		const productdata = req.userId;
		const user = await User.findById(productdata);

		console.log(user);

		if (user) {
			console.log('Si');
		} else {
			return res.status(404).json({error: 'Usuario no encontrado'});
		}

		console.log('aca');
		console.log(user.favoriteProducts);
		console.log(user.favoriteCategories);

		if (user.favoriteProducts.length === 0 && user.favoriteCategories.length === 0) {
			console.log('Aqui');
			recommendations = await Product.aggregate([{$sample: {size: 10}}]);
			return res.status(200).json({recommendations});
		}else if (favoriteCategories.length === 0 && favoriteProducts.length > 0) {
			// Si no hay categorías favoritas pero hay productos favoritos, busca solo por productos favoritos
			recommendations = await Product.find({
			  _id: { $in: favoriteProducts }
			}).limit(10);
		  } else if (favoriteCategories.length > 0 && favoriteProducts.length === 0) {
			// Si hay categorías favoritas pero no hay productos favoritos, busca solo por categorías
			recommendations = await Product.find({
			  categories: { $in: favoriteCategories }
			}).limit(10);
		  } else {
			// Caso estándar: busca productos en categorías favoritas y excluye los productos favoritos
			recommendations = await Product.find({
			  categories: { $in: favoriteCategories },
			  _id: { $nin: favoriteProducts }
			}).limit(10);
		  }

		return res.status(200).json({recommendations});
	} catch (error) {
		return res.status(500).json({error: 'Error al obtener recomendaciones de productos'});
	}
};
