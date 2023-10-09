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

	async getProducts() {
		const products = await ProductModel.find();
		return products;
	}

	async getProductById(productId: string) {
		const product = await ProductModel.findById(productId);
		return product;
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

