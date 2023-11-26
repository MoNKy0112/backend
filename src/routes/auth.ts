import {Router} from 'express';
import {signUp, signIn, profile, passwordReset, requestPasswordReset} from '../controllers/auth.controller';
import {tokenValidation, tokenResetValidation, refreshToken, generateNewAccessToken} from '../middlewares/validateToken';
import {userVerified} from '../middlewares/userVerified';
import validate from '../validators/auth';
const router: Router = Router();

router.post('/signup', validate.validateSignUp, signUp);

router.post('/signin', validate.validateSignIn, signIn);

router.use('/profile', tokenValidation);

router.get('/profile', profile);

router.post('/resetpassword', validate.validateResetPassword, requestPasswordReset);

router.use('/newpassword', tokenResetValidation);

router.post('/newpassword', validate.validateNewPassword, passwordReset);

router.use('/newtoken', refreshToken);

router.get('/newtoken', generateNewAccessToken);

export default router;
