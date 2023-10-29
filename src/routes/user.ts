import express from 'express';
import UserController from '../controllers/user.controller';
import {tokenValidation} from '../middlewares/validateToken';

const router = express.Router();

router.get('/users', UserController.getUsers);
router.get('/user/:id', UserController.getUserById);
router.put('/users/:cedula', UserController.updateUser);
router.delete('/users/:cedula', UserController.deleteUser);

router.use('/user', tokenValidation);
router.put('/user/cart/add', UserController.addToCart);
router.put('/user/cart/remove', UserController.removeOfCart);
router.put('/user/favprod/add', UserController.addFavoriteProducts);
router.put('/user/favprod/remove', UserController.removeFavoriteProducts);
router.put('/user/favcateg/add', UserController.addFavoriteCategories);
router.put('/user/favcateg/remove', UserController.removeFavoriteCategories);
export default router;
