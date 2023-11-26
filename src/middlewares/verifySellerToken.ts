import {type Request, type Response, type NextFunction} from 'express';
import authFacade from '../facades/auth.facade';

export const verifyTokenMp = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {userId} = req;
		const user = await authFacade.getuser(userId);

		if (!user.accessTokenMp) throw new Error('Necesitas vincular tu cuenta de mercadopago');

		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).json();
		} else {
			console.error('unknown error:', error);
			res.status(500).json('Unknown error');
		}
	}
};
