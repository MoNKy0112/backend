import {type Request, type Response, type NextFunction} from 'express';
import authFacade from '../facades/auth.facade';

export const userVerified = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {userId} = req;

		const user = await authFacade.getuser(userId);

		if (!user.emailVerified) {
			throw new Error('user not verified');
		}

		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).json(error.message);
		} else {
			res.status(500).json(error);
		}
	}
};
