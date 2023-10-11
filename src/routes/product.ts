import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByFilters } from '../controllers/product.controller';
import {tokenValidation} from '../middlewares/validateToken';


const router = express.Router();


router.get('/product', getProducts);
router.get('/product/:productId', getProductById);
router.get('/productsby', getProductsByFilters);

router.use('/product', tokenValidation);
router.post('/product', createProduct);
router.put('/product/:productId', updateProduct);
router.delete('/product/:productId', deleteProduct);
export default router;
