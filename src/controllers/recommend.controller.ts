import Product from '../models/Product';
import {type Request, type Response} from 'express';

// Controlador para obtener recomendaciones de productos
export const getRecommendations = async (req: Request, res: Response) => {
	try {
		console.log(req.userId);
		const {favoriteCategories, favoriteProducts} = req.userId;

		// Buscar productos que tengan categorías en común con las categorías favoritas del usuario y que no estén en su lista de productos favoritos
		const recommendations = await Product.find({
			categories: {$in: favoriteCategories},
			_id: {$nin: favoriteProducts},
		}).limit(10); // Puedes ajustar el número de recomendaciones según tus necesidades

		return res.status(200).json({recommendations});
	} catch (error) {
		return res.status(500).json({error: 'Error al obtener recomendaciones de productos'});
	}
};

export default {getRecommendations};
