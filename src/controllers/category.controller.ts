import { Request, Response } from "express";
import Category from "../models/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const newCategory = new Category({
      name,
      description,
    });

    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryToUpdate = req.params.categoryId;
    const { name, description } = req.body;
    const updatedCategoryFields = {
      name,
      description,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryToUpdate,
      updatedCategoryFields,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la categoría" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryToDelete = req.params.categoryId;
    const deletedCategory = await Category.findByIdAndDelete(categoryToDelete);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};
