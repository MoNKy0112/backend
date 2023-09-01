import express from 'express';
import { createUser, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = express.Router();

router.post('/users', createUser);
router.get('/users/:cedula', getUserById);
router.put('/users/:userId', updateUser);
router.delete('/users/:cedula', deleteUser);

export default router;