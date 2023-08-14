import {Router} from 'express';
import { signUp,signIn,profile,resetPassword,changePassword} from '../controllers/auth.controller';
import { tokenValidation, tokenResetValidation} from '../libs/validateToken';

const router:Router = Router();

router.post('/signup',signUp);

router.post('/signin',signIn);

router.get('/profile',tokenValidation,profile);

router.get('/resetpassword',resetPassword);

router.post('/changepassword',changePassword);
export default router;