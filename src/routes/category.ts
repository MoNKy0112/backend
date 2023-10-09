import express from 'express';
import categoryController from '../controllers/category.controller';

const router = express.Router();

router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getCategories);

export default router;
