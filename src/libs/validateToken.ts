import {type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken';

type IPayload = {
	_id: string;
	iat: number;
	exp: number;

};

export const tokenValidation = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.authToken as string;

	console.log(token);
	if (!token) return res.status(401).json('Acceso denegado');

	const payload = jwt.verify(token, process.env.TOKEN_SECRET ?? 'tokentest') as IPayload;

	req.userId = payload._id;

	next();
};

export const tokenResetValidation = (req: Request, res: Response, next: NextFunction) => {
	const token = req.query.reset_token as string;

	if (!token) return res.status(401).json('Acceso denegado');

	const payload = jwt.verify(token, process.env.TOKEN_SECRET_RESET ?? 'resettokentest') as IPayload;

	req.userId = payload._id;

	next();
};
