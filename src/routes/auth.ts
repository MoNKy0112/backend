import {Router} from 'express';
import {signUp, signIn, profile, passwordReset, requestPasswordReset} from '../controllers/auth.controller';
import {tokenValidation, tokenResetValidation, refreshToken, generateNewAccessToken} from '../middlewares/validateToken';
import validate from '../validators/auth';
const router: Router = Router();

router.post('/signup', validate.validateSignUp, signUp);

router.post('/signin', validate.validateSignIn, signIn);

router.use('/profile', tokenValidation);

router.get('/profile', profile);

router.post('/resetpassword', requestPasswordReset);

router.use('/newpassword', tokenResetValidation);

router.post('/newpassword', passwordReset);

router.use('/newtoken', refreshToken);

router.post('/newtoken', generateNewAccessToken);

export default router;
