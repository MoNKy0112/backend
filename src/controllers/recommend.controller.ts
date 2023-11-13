/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Product from '../models/Product';
import User from '../models/User';
import {type Request, type Response} from 'express';

export const getRecommendations = async (req: Request, res: Response) => {
	try {
		let recommendations;
		const productdata = req.userId;
		const user = await User.findById(productdata);

		if (!user) {
			recommendations = await Product.aggregate([{$sample: {size: 10}}]);
			return res.status(200).json({recommendations});
		}

		const {favoriteCategories, favoriteProducts} = user;

		switch (true) {
			case favoriteProducts.length === 0 && favoriteCategories.length === 0:
				recommendations = await Product.aggregate([{$sample: {size: 10}}]);
				break;

			case favoriteProducts.length > 0 && favoriteCategories.length === 0:
				recommendations = await Product.find({
					_id: {$in: favoriteProducts},
				}).limit(10);
				break;

			case favoriteProducts.length === 0 && favoriteCategories.length > 0:
				recommendations = await Product.find({
					categories: {$in: favoriteCategories},
				}).limit(10);
				break;

			default:
				recommendations = await Product.find({
					categories: {$in: favoriteCategories},
					_id: {$nin: favoriteProducts},
				}).limit(10);
				break;
		}

		const remaining = 10 - recommendations.length;
		const additionalRecommendations = await Product.aggregate([{$sample: {size: remaining}}]);
		recommendations = recommendations.concat(additionalRecommendations);

		return res.status(200).json({recommendations});
	} catch (error) {
		return res.status(500).json({error: 'Error al obtener recomendaciones de productos'});
	}
};
