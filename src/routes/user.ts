import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();

router.get('/users', UserController.getUsers);
router.put('/users/:cedula', UserController.updateUser);
router.delete('/users/:cedula', UserController.deleteUser);

export default router;
