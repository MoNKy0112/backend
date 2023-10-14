import {type Types, type ObjectId, type UpdateQuery} from 'mongoose';
import Category, {type ICategory} from '../models/Category';

class CategoryFacade {
	public async createCategory(categoryData: ICategory) {
		const newCategory = new Category(categoryData);
		const savedCategory = await newCategory.save();
		return savedCategory;
	}

	public async getCategories() {
		const categories = await Category.find();
		return categories;
	}

	public async getCategoryById(categoryId: string) {
		const category = await Category.findById(categoryId);
		return category;
	}

	public async updateCategory(categoryId: string, categoryData: ICategory) {
		const updatedCategory = await Category.findByIdAndUpdate(
			categoryId,
			categoryData,
			{new: true},
		);
		return updatedCategory;
	}

	public async deleteCategory(categoryId: string) {
		const deletedCategory = await Category.findByIdAndDelete(categoryId);
		return deletedCategory;
	}
}

export default new CategoryFacade();
