import {type Types, type ObjectId, type UpdateQuery, type QueryOptions} from 'mongoose';
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
		const newProduct = new ProductModel(productData);
		const savedProduct = await newProduct.save();
		return savedProduct;
	}

	async getProductsByFilters(filters: InterfaceProductFilters) {
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
		return products;
	}

	async getProducts() {
		const products = await ProductModel.find();
		return products;
	}

	async getProductById(productId: string) {
		const product = await ProductModel.findById(productId);
		return product;
	}

	async getProductsBySeller(sellerId: string) {
		const products = await ProductModel.find({sellerId});
		return products;
	}

	async updateProduct(productId: string, productData: IProduct) {
		const updatedProduct = await ProductModel.findByIdAndUpdate(productId, productData, {new: true});
		return updatedProduct;
	}

	async deleteProduct(productId: string) {
		const deletedProduct = await ProductModel.findByIdAndDelete(productId);
		return deletedProduct;
	}
}

export default new ProductFacade();

