import Category, {type ICategory} from '../models/Category';

class CategoryFacade {
	public async createCategory(categoryData: ICategory) {
		try {
			const newCategory = new Category(categoryData);
			if (!newCategory) throw new Error('Error trying to create category');
			const savedCategory = await newCategory.save();
			if (!savedCategory) throw new Error('Error trying to save category');
			return savedCategory;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to create category');
			}
		}
	}

	public async getCategories() {
		try {
			const categories = await Category.find();
			if (!categories) throw new Error('Error trying to get all categories');
			return categories;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to get all categories');
			}
		}
	}

	public async getCategoryById(categoryId: string) {
		try {
			const category = await Category.findById(categoryId);
			if (!category) throw new Error('Error trying to get category by id');
			return category;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to get category by id');
			}
		}
	}

	public async updateCategory(categoryId: string, categoryData: ICategory) {
		try {
			const updatedCategory = await Category.findByIdAndUpdate(
				categoryId,
				categoryData,
				{new: true},
			);
			if (!updatedCategory) throw new Error('Error trying to update category');
			return updatedCategory;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to update category');
			}
		}
	}

	public async deleteCategory(categoryId: string) {
		try {
			const deletedCategory = await Category.findByIdAndDelete(categoryId);
			if (!deletedCategory) throw new Error('Error trying to delete category');
			return deletedCategory;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to delete category');
			}
		}
	}
}

export default new CategoryFacade();
