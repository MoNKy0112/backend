import {type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import token from '../utilities/token';

type IPayload = {
	_id: string;
	iat: number;
	exp: number;

};

export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.authToken as string;

		if (!token) throw new Error('token not found');

		const payload = jwt.verify(token, process.env.TOKEN_SECRET ?? 'TOKEN_SECRET') as IPayload;

		req.userId = payload._id;
		// Res.status(200).json(payload);
		next();
	} catch (error) {
		// Res.status(401).json(error);
		if (error instanceof Error) {
			if (error.message === 'jwt expired') {
				return refreshToken(req, res, next);
			}

			res.status(401).json(error.message);
		} else {
			res.status(500).json('An unknown error occurred.');
		}
	}
};

export const tokenResetValidation = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.query.reset_token as string;

		if (!token) throw new Error('token reset validation not found');

		const payload = jwt.verify(token, process.env.TOKEN_SECRET_RESET ?? 'TOKEN_SECRET_RESET') as IPayload;

		req.userId = payload._id;

		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).json(error.message);
		} else {
			res.status(500).json('An unknown error occurred.');
		}
	}
};

export const tokenUserVerifyValidation = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.query.verifyemailtoken as string;

		if (!token) throw new Error('token user verify not found');

		const payload = jwt.verify(token, process.env.TOKEN_VERIFY_EMAIL_SECRET ?? 'TOKEN_VERIFY_EMAIL_SECRET') as IPayload;

		req.userId = payload._id;

		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).json(error.message);
		} else {
			res.status(500).json('An unknown error occurred.');
		}
	}
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.refreshToken as string;
	if (!token) throw new Error('Tokens do not exist');
	try {
		const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET ?? 'REFRESH_TOKEN_SECRET') as IPayload;

		req.userId = payload._id;

		await generateNewAccessToken(req, res, next);

		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).json(error.message);
		} else {
			res.status(500).json('An unknown error occurred.');
		}
	}
};

export const generateNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = await token.generateAccessToken({_id: req.userId}, 1);
		console.log('new token');
		res.cookie('authToken', accessToken, {
			secure: !(process.env.NODE_ENV === 'dev'), // Solo se envía a través de conexiones HTTPS
			httpOnly: true, // No es accesible desde JavaScript en el navegador
			sameSite: 'none',
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).json(error.message);
		} else {
			console.error(error);
			res.status(500).json('An unknown error occurred.');
		}
	}
};
