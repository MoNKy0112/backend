import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

router.get('/users', userController.getUsers);
router.put('/users/:cedula', userController.updateUser);
router.delete('/users/:cedula', userController.deleteUser);

export default router;
