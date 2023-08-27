import {type Request, type Response, type NextFunction} from 'express';
import Product from '../models/Product';
import {type ObjectId} from 'mongoose';

export const verifyCartProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const productGroup: Array<{
			productId: ObjectId;
			quantity: number;
			subtotal: number;
		}> = [];

		for (const cartProduct of req.body.cartProducts) {
			const product = await Product.findById(cartProduct.id);
			const quantity = cartProduct.quantity as number;
			if (!product) return res.status(400).json(`The product whit id ${cartProduct.id} doesnt exist`);

			if (product.stock < quantity) {
				return res.status(400).json(`Product with ID ${cartProduct.id} is not available in the requested quantity`);
			}

			const price = (product.price - (product.price * product.discount));

			productGroup.push({
				productId: product._id as ObjectId,
				quantity,
				subtotal: price * quantity,
			});
		}

		req.body.verifiedProducts = productGroup;
		next();
	} catch (error) {
		res.status(500).json({error: 'Error al verificar los productos del carrito'});
	}
};
