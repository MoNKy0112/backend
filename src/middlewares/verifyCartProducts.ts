import {type Request, type Response, type NextFunction} from 'express';
import {type ObjectId} from 'mongoose';
import productFacade from '../facades/product.facade';

export const verifyCartProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const productGroup: Array<{
			productId: ObjectId;
			quantity: number;
			subtotal: number;
		}> = [];

		for (const cartProduct of req.body.cartProducts) {
			const product = await productFacade.getProductById(cartProduct.id);
			const quantity = cartProduct.quantity as number;

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

// TODO: revisar middleware ya no utilizado
export const verifyStockToAdd = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const productId = req.body.product as string;
		const quantity = req.body.quantity as number;
		const productStock = (await productFacade.getProductById(productId)).stock;

		if (productStock < quantity) {
			res.status(400).json('Insufficient stock for demand');
		}

		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json({error: 'Error when trying if there is enough stock'});
		}
	}
};
