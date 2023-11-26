import express from 'express';
import {getRecommendations} from '../controllers/recommend.controller';
import {tokenValidation} from '../middlewares/validateToken';

const router = express.Router();

router.get('/recommend', tokenValidation, getRecommendations);

export default router;
