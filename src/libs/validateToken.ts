import {type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken';

type IPayload = {
	_id: string;
	iat: number;
	exp: number;

};

export const tokenValidation = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.authToken as string;

		if (!token) throw new Error('token not found');

		const payload = jwt.verify(token, process.env.TOKEN_SECRET ?? 'tokentest') as IPayload;
		req.userId = payload._id;
		res.json(payload);
	} catch (error) {
		res.json(error);
	}
};

export const tokenResetValidation = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.query.reset_token as string;

		if (!token) throw new Error('token not found');

		const payload = jwt.verify(token, process.env.TOKEN_SECRET_RESET ?? 'resettokentest') as IPayload;

		req.userId = payload._id;

		next();
	} catch (error) {
		res.json(error);
	}
};

export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.refreshToken as string;
		if (!token) throw new Error('refresh token non-existent');
		const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET ?? 'refreshtokentest') as IPayload;

		req.userId = payload._id;

		next();
	} catch (error) {
		res.json(error);
	}
};

export const generateNewAccessToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const key = process.env.TOKEN_SECRET ?? 'tokentest';

		const accessToken: string = jwt.sign({_id: req.userId}, key, {
			expiresIn: 60 * 15,
		});

		res.cookie('authToken', accessToken)
			.json({accessToken});
	} catch (error) {
		res.json(error);
	}
};
