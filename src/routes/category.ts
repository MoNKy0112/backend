import express from 'express';
import {createCategory, getCategories, getCategoryById, updateCategory, deleteCategory} from '../controllers/category.controller';
import validate from '../validators/category';
const router = express.Router();

router.post('/categories', validate.validateCreate, createCategory);
router.get('/categories', getCategories);
router.get('/categories/:categoryId', getCategoryById);
router.put('/categories/:categoryId', validate.validateUpdate, updateCategory);
router.delete('/categories/:categoryId', deleteCategory);

export default router;
