import express from 'express';
import {createProduct, getProducts, getProductById, updateProduct, deleteProduct} from '../controllers/product.controller';

const router = express.Router();

router.post('/product', createProduct);
router.get('/product', getProducts);
router.get('/product/:productId', getProductById);
router.put('/product/:productId', updateProduct);
router.delete('/product/:productId', deleteProduct);

export default router;
