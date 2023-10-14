import express from 'express';
import {createCategory, getCategories, getCategoryById, updateCategory, deleteCategory} from '../controllers/category.controller';

const router = express.Router();

router.post('/categories', createCategory);
router.get('/categories', getCategories);

export default router;
