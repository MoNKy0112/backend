import type mongoose from 'mongoose';
import {type IUser} from '../models/User';
import {type IProduct} from '../models/Product';

class RecommendSystem {
	constructor(private readonly userModel: mongoose.Model<IUser>, private readonly productModel: mongoose.Model<IProduct>) { }

	async recommendProducts(userId: mongoose.Types.ObjectId, cantidad: number): Promise<IProduct[]> {
		// eslint-disable-next-line no-useless-catch
		try {
			const usuario = await this.userModel
				.findById(userId)
				.populate('viewedProducts')
				.populate('favouriteProducts')
				.populate('orders');

			if (!usuario) {
				const productosRecomendados = await this.productModel.find().limit(cantidad);
				return productosRecomendados;
			}

			const productScores = new Map<IProduct, number>();

			for (const productId of usuario.viewedProducts) {
				// eslint-disable-next-line no-await-in-loop
				const productInfo = await this.productModel.findById(productId);
				if (productInfo) {
					if (!productScores.has(productInfo)) {
						productScores.set(productInfo, 0);
					}

					productScores.set(productInfo, productScores.get(productInfo)! + 1);
				}
			}

			for (const productId of usuario.favoriteProducts) {
				// eslint-disable-next-line no-await-in-loop
				const productInfo = await this.productModel.findById(productId);
				if (productInfo) {
					if (!productScores.has(productInfo)) {
						productScores.set(productInfo, 0);
					}

					productScores.set(productInfo, productScores.get(productInfo)! + 3);
				}
			}

			for (const order of usuario.orders) {
				for (const product of order.products) {
					// eslint-disable-next-line no-await-in-loop
					const productInfo = await this.productModel.findById(product.productId);

					if (productInfo) {
						if (!productScores.has(productInfo)) {
							productScores.set(productInfo, 0);
						}

						productScores.set(productInfo, productScores.get(productInfo)! + 5);
					}
				}
			}

			const sortedProducts = [...productScores.entries()].sort((a, b) => b[1] - a[1]);

			return sortedProducts.slice(0, cantidad).map(entry => entry[0]);
		} catch (error) {
			throw error;
		}
	}
}
