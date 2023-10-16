import {type Request, type Response} from 'express';
import CategoryFacade from '../facades/category.facade';


export const createCategory = async (req: Request, res: Response) => {
	try {
		const categoryData = req.body;
		const savedCategory = await CategoryFacade.createCategory(categoryData); // Llama a la fachada para crear la categoría
		return res.status(201).json(savedCategory);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al crear la categoría'});
	}
};

export const getCategories = async (req: Request, res: Response) => {
	try {
		const categories = await CategoryFacade.getCategories(); // Llama a la fachada para obtener las categorías
		return res.status(200).json(categories);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al obtener las categorías'});
	}
};

export const getCategoryById = async (req: Request, res: Response) => {
	try {
		const {categoryId} = req.params;
		const category = await CategoryFacade.getCategoryById(categoryId); // Llama a la fachada para obtener la categoría por ID

		if (!category) {
			return res.status(404).json({error: 'Categoría no encontrada'});
		}

		return res.status(200).json(category);
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Error al obtener la categoría'});
	}
};

export const updateCategory = async (req: Request, res: Response) => {
	try {
		const categoryToUpdate = req.params.categoryId;
		const categorydata = req.body;

		const updatedCategory = await CategoryFacade.updateCategory(
			categoryToUpdate,
			categorydata,
		);

		if (!updatedCategory) {
			return res.status(404).json({error: 'Categoría no encontrada'});
		}

		res.json(updatedCategory);
	} catch (error) {
		res.status(500).json({error: 'Error al actualizar la categoría'});
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
	try {
		const categoryToDelete = req.params.categoryId;
		const deletedCategory = await CategoryFacade.deleteCategory(categoryToDelete);

		if (!deletedCategory) {
			return res.status(404).json({error: 'Categoría no encontrada'});
		}
		
		res.json(deletedCategory);
	} catch (error) {
		res.status(500).json({error: 'Error al eliminar la categoría'});
	}
};
