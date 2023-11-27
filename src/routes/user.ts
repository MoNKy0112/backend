import express from 'express';
import UserController from '../controllers/user.controller';
import {tokenValidation} from '../middlewares/validateToken';
import validate from '../validators/user';
import {userVerified} from '../middlewares/userVerified';

const router = express.Router();

router.get('/users', UserController.getUsers);
router.get('/user/:id', validate.validateGetById, UserController.getUserById);
router.put('/users/:cedula', validate.validateUpdate, UserController.updateUser);
router.delete('/users/:cedula', UserController.deleteUser);

router.use('/user', tokenValidation, userVerified);
router.put('/user/cart/add', validate.validateAddCart, UserController.addToCart);
router.put('/user/cart/remove', validate.validateRemoveCart, UserController.removeOfCart);
router.put('/user/favprod/add', validate.validateAddProd, UserController.addFavoriteProducts);
router.put('/user/favprod/remove', validate.validateRemoveProd, UserController.removeFavoriteProducts);
router.put('/user/favcateg/add', validate.validateAddCat, UserController.addFavoriteCategories);
router.put('/user/favcateg/remove', validate.validateRemoveCat, UserController.removeFavoriteCategories);
export default router;
