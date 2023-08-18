import {Router} from 'express';
import {signUp, signIn, profile, passwordReset, requestPasswordReset} from '../controllers/auth.controller';
import {tokenValidation, tokenResetValidation} from '../libs/validateToken';

const router: Router = Router();

router.post('/signup', signUp);

router.post('/signin', signIn);

router.get('/profile', tokenValidation, profile);

router.get('/req-pass-reset', requestPasswordReset);

router.post('/password-reset', tokenResetValidation, passwordReset);
export default router;
