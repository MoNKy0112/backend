import {type ObjectId} from 'mongoose';
import Product, {type IProduct} from '../models/Product';

class ProductFacade {
	public async createProduct(data: Document) {
		const product: IProduct = new Product(data);
		return product;
	}

	async getProductById(productId: ObjectId) {
		const product = await Product.findById(productId);
		return product;
	}

	public async updateProduct(productId: ObjectId, newData: Document) {
		const product = Product.findByIdAndUpdate(productId, newData, {new: true});
		return product;
	}

	public async deleteProduct(productId: ObjectId) {
		const deletedProduct = await Product.findByIdAndDelete(productId);
		return deletedProduct;
	}

	async getProductsByCategory(categoryId: ObjectId) {
		const products = await Product.find({categories: categoryId});
		return products;
	}
}

export default new ProductFacade();
