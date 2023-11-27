import {type ValidationChain, body, check, param} from 'express-validator';
import validateResult from '../utilities/validateHelper';
import {type Request, type NextFunction, type Response} from 'express';

class ValidateOrder {
	public createMeeting = [
		body('dateMeeting')
			.exists()
			.toDate()
			.isISO8601()
			.notEmpty(),
		body('place')
			.exists()
			.isNumeric()
			.notEmpty(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];
}

export default new ValidateOrder();
