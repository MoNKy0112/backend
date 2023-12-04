import {type Types, type ObjectId, type UpdateQuery, type QueryOptions, type Model} from 'mongoose';
import ProductModel, {type IProduct} from '../models/Product';

export type InterfaceProductFilters = {
	seller_id?: Types.ObjectId;
	name?: string;
	priceMin?: number;
	priceMax?: number;
	categories?: string[];
	discountMin?: number;
};

class ProductFacade {
	async createProduct(productData: IProduct) {
		try {
			const newProduct = new ProductModel(productData);
			if (!newProduct) throw new Error('Error trying to create product');
			const savedProduct = await newProduct.save();
			if (!savedProduct) throw new Error('Error trying to save product');
			return savedProduct;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to create product');
			}
		}
	}

	async getProductsByFilters(filters: InterfaceProductFilters) {
		try {
			const {seller_id, name, priceMin, priceMax, categories, discountMin} = filters;
			const query: QueryOptions = {};
			if (seller_id) query.sellerId = seller_id;
			if (name) query.name = {$regex: name, $options: 'i'};
			if (priceMin || priceMax) query.price = {};
			if (priceMin) query.price.$gte = priceMin;
			if (priceMax) query.price.$lte = priceMax;
			if (categories) query.categories = {$in: categories};
			if (discountMin) query.discount = {$gte: discountMin};

			const products = await ProductModel.find(query);
			if (!products) throw new Error('Error trying to obtain filtered products');
			return products;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to obtain filtered products');
			}
		}
	}

	async getProducts() {
		try {
			const products = await ProductModel.find();
			if (!products) throw new Error('Error trying to get all products');
			return products;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to get all products');
			}
		}
	}

	async getProductById(productId: string | ObjectId) {
		try {
			const product = await ProductModel.findById(productId);
			if (!product) throw new Error('Error trying to get a product for your ID');
			return product;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to get a product for your ID');
			}
		}
	}

	async getProductsBySeller(sellerId: string) {
		try {
			const products = await ProductModel.find({sellerId});
			if (!products) throw new Error('Error trying to get the products from a seller');
			return products;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to get productss from a seller');
			}
		}
	}

	async updateProduct(productId: string, productData: Partial<IProduct>) {
		try {
			const updatedProduct = await ProductModel.findByIdAndUpdate(productId, productData, {new: true});
			if (!updatedProduct) throw new Error('Error trying update product');
			return updatedProduct;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to update product');
			}
		}
	}

	async reduceStock(productId: string | ObjectId, quantity: number) {
		try {
			const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {$inc: {stock: -quantity}}, {new: true});
			if (!updatedProduct) throw new Error('Error trying to reduce stock');
			return updatedProduct;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to reduce stock');
			}
		}
	}

	async addStock(productId: string | ObjectId, quantity: number) {
		try {
			const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {$inc: {stock: quantity}}, {new: true});
			if (!updatedProduct) throw new Error('Error trying to reduce stock');
			return updatedProduct;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to reduce stock');
			}
		}
	}

	async deleteProduct(productId: string) {
		try {
			const deletedProduct = await ProductModel.findOneAndDelete({_id: productId});
			if (!deletedProduct) throw new Error('Error trying to eliminate product');
			return deletedProduct;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to eliminate product');
			}
		}
	}
}

export default new ProductFacade();

