import express from 'express';
import {getUsers, updateUser, deleteUser} from '../controllers/user.controller';

const router = express.Router();

router.get('/users', getUsers);
router.put('/users/:cedula', updateUser);
router.delete('/users/:cedula', deleteUser);

export default router;
