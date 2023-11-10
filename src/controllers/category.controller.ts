import {type Request, type Response} from 'express';
import CategoryFacade from '../facades/category.facade';
import {type ICategory} from 'models/Category';

export const createCategory = async (req: Request, res: Response) => {
	try {
		const categoryData: ICategory = {
			name: req.body.name as string,
			description: req.body.description as string,
		};
		const savedCategory = await CategoryFacade.createCategory(categoryData); // Llama a la fachada para crear la categoría
		res.status(201).json(savedCategory);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json({error: 'Error al crear la categoría'});
		}
	}
};

export const getCategories = async (req: Request, res: Response) => {
	try {
		const categories = await CategoryFacade.getCategories(); // Llama a la fachada para obtener las categorías
		res.status(200).json(categories);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json({error: 'Error al obtener las categorías'});
		}
	}
};

export const getCategoryById = async (req: Request, res: Response) => {
	try {
		const {categoryId} = req.params;
		const category = await CategoryFacade.getCategoryById(categoryId); // Llama a la fachada para obtener la categoría por ID

		if (!category) {
			return res.status(404).json({error: 'Categoría no encontrada'});
		}

		res.status(200).json(category);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json({error: 'Error al obtener la categoría'});
		}
	}
};

export const updateCategory = async (req: Request, res: Response) => {
	try {
		const categoryToUpdate = req.params.categoryId;
		const categoryData: ICategory = {
			name: req.body.name as string,
			description: req.body.description as string,
		};

		const updatedCategory = await CategoryFacade.updateCategory(
			categoryToUpdate,
			categoryData,
		);

		res.json(updatedCategory);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json({error: 'Error al actualizar la categoría'});
		}
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
	try {
		const categoryToDelete = req.params.categoryId;
		const deletedCategory = await CategoryFacade.deleteCategory(categoryToDelete);

		res.json(deletedCategory);
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json(error);
		} else {
			res.status(500).json({error: 'Error al eliminar la categoría'});
		}
	}
};
