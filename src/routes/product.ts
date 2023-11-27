import express from 'express';
import {createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByFilters, getProductsBySeller} from '../controllers/product.controller';
import {tokenValidation} from '../middlewares/validateToken';
import validate from '../validators/product';
import {verifyTokenMp} from '../middlewares/verifySellerToken';
import {userVerified} from '../middlewares/userVerified';
const router = express.Router();

router.get('/product', getProducts);
router.get('/product/:productId', getProductById);
router.get('/productsby', validate.validateFilter, getProductsByFilters);

router.use('/product', tokenValidation, userVerified, verifyTokenMp);
router.post('/product', validate.validateCreate, createProduct);
router.get('/productseller', tokenValidation, userVerified, getProductsBySeller);
router.put('/product/:productId', validate.validateUpdate, updateProduct);
router.delete('/product/:productId', deleteProduct);
export default router;
