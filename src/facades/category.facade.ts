import {type ObjectId} from 'mongoose';
import Category, {type ICategory} from '../models/Category';

class CategoryFacade {
	async createCategory(data: ObjectId) {
		const category: ICategory = new Category(data);
		return category;
	}

	async getCategoryById(categoryId: ObjectId) {
		const category = await Category.findById(categoryId);
		return category;
	}

	public async updateCategory(categoryId: ObjectId, newData: Document) {
		const category = Category.findByIdAndUpdate(categoryId, newData, {new: true});
		return category;
	}

	public async deleteCategory(categoryId: ObjectId) {
		const deletedCategory = await Category.findByIdAndDelete(categoryId);
		return deletedCategory;
	}
}

export default new CategoryFacade();
