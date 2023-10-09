import {type Request, type Response} from 'express';
import Category, {type ICategory} from '../models/Category';

class CategoryFacade {
	public async createCategory(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const categoryData: ICategory = req.body as ICategory;
			const newCategory = new Category(categoryData);
			const savedCategory = await newCategory.save();
			return res.status(201).json(savedCategory);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al crear la categoría'});
		}
	}

	public async getCategoryById(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const {categoryId} = req.params;
			const category = await Category.findById(categoryId);
			if (!category) {
				return res.status(404).json({error: 'Categoría no encontrada'});
			}

			return res.status(200).json(category);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al obtener la categoría'});
		}
	}

	public async getCategories(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const categories = await Category.find();
			return res.status(200).json(categories);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al obtener las categorías'});
		}
	}

	public async updateCategory(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const categoryToUpdate = req.params.categoryId;
			const {name, description} = req.body;
			const updatedCategoryFields = {
				name,
				description,
			};

			const updatedCategory = await Category.findByIdAndUpdate(
				categoryToUpdate,
				updatedCategoryFields,
				{new: true},
			);

			if (!updatedCategory) {
				return res.status(404).json({error: 'Categoría no encontrada'});
			}

			res.json(updatedCategory);
		} catch (error) {
			res.status(500).json({error: 'Error al actualizar la categoría'});
		}
	}

	public async deleteCategory(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const {categoryId} = req.params;
			const deletedCategory = await Category.findByIdAndDelete(categoryId);
			if (!deletedCategory) {
				return res.status(404).json({error: 'Categoría no encontrada'});
			}

			return res.json(deletedCategory);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Error al eliminar la categoría'});
		}
	}
}

export default new CategoryFacade();
