import {Router} from 'express';
import {signUp, signIn, profile, passwordReset, requestPasswordReset} from '../controllers/auth.controller';
import {tokenValidation, tokenResetValidation, refreshToken, generateNewAccessToken} from '../libs/validateToken';

const router: Router = Router();

router.post('/signup', signUp);

router.post('/signin', signIn);

router.get('/accesstoken', tokenValidation);

router.get('/profile', profile);

router.get('/refreshtoken', refreshToken);

router.get('/req-pass-reset', requestPasswordReset);

router.post('/password-reset', tokenResetValidation, passwordReset);

router.post('/newtoken', refreshToken, generateNewAccessToken);

export default router;
