import express from 'express';
import ProductController from '../controllers/product.controller';

const router = express.Router();

router.post('/product', ProductController.createProduct);
router.get('/product', ProductController.getProducts);
router.get('/product/:productId', ProductController.getProductById);
router.put('/product/:productId', ProductController.updateProduct);
router.delete('/product/:productId', ProductController.deleteProduct);

export default router;
