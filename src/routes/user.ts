import express from 'express';
import { createUser, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = express.Router();

router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

export default router;