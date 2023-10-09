import {type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import token from '../utilities/token';

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
		// Res.status(200).json(payload);
		next();
	} catch (error) {
		// Res.status(401).json(error);
		if (error instanceof Error) {
			console.error('Error whit token:', error.message);
			res.status(401).json(error.message);
		} else {
			console.error('Unknown error:', error);
			res.status(500).json('An unknown error occurred.');
		}
	}
};

export const tokenResetValidation = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.query.reset_token as string;

		if (!token) throw new Error('token reset validation not found');

		const payload = jwt.verify(token, process.env.TOKEN_SECRET_RESET ?? 'resettokentest') as IPayload;

		req.userId = payload._id;

		next();
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error whit token:', error.message);
			res.status(401).json(error.message);
		} else {
			console.error('Unknown error:', error);
			res.status(500).json('An unknown error occurred.');
		}
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
		if (error instanceof Error) {
			console.error('Error whit token:', error.message);
			res.status(401).json(error.message);
		} else {
			console.error('Unknown error:', error);
			res.status(500).json('An unknown error occurred.');
		}
	}
};

export const generateNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = await token.generateAccessToken({_id: req.userId});

		res.cookie('authToken', accessToken)
			.json({accessToken});
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error whit token:', error.message);
			res.status(401).json(error.message);
		} else {
			console.error('Unknown error:', error);
			res.status(500).json('An unknown error occurred.');
		}
	}
};
