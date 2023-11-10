import {type Request, type Response, type NextFunction} from 'express';
import {type ObjectId} from 'mongoose';
import productFacade from '../facades/product.facade';
import authFacade from '../facades/auth.facade';
import {type IProduct} from '../models/Product';

export const verifyCartProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const productGroup: Array<{
			productId: ObjectId;
			quantity: number;
			subtotal: number;
		}> = [];
		const user = await authFacade.getuser(req.userId);
		if (!user) throw new Error('error');
		const results = [];
		for (const cart of user.cart) {
			const {products} = cart;
			for (const cartProduct of products) {
				results.push({cartProduct, product: productFacade.getProductById(cartProduct.productId)});
			}
		}

		const products = await Promise.all(results);
		if (!products) throw new Error('');

		const productPromises = products.map(async p => {
			const {product} = p;

			if (product instanceof Promise) {
				return product;
			}

			return product;
		});

		const resolvedProducts = await Promise.all(productPromises);

		for (let i = 0; i < resolvedProducts.length; i++) {
			const product = resolvedProducts[i];
			const {cartProduct} = products[i];
			const {quantity} = cartProduct;
			if (product.stock < quantity) {
				return res.status(400).json(`Product with ID ${String(cartProduct.productId)} 
				& name ${String(product.name)} is not available in the requested quantity`);
			}

			const price = (product.price - (product.price * product.discount));

			productGroup.push({
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				productId: product.id,
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
