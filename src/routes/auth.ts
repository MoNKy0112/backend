import {Router} from 'express';
import {signUp, signIn, profile, passwordReset, requestPasswordReset} from '../controllers/auth.controller';
import {tokenValidation, tokenResetValidation, refreshToken, generateNewAccessToken} from '../libs/validateToken';

const router: Router = Router();

router.post('/signup', signUp);

router.post('/signin', signIn);

router.use('/profile', tokenValidation);

router.get('/profile', profile);

router.get('/resetpassword', requestPasswordReset);

router.use('/newpassword', tokenResetValidation);

router.post('/newpassword', passwordReset);

router.use('/newtoken', refreshToken);

router.post('/newtoken', generateNewAccessToken);

export default router;
