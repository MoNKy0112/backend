import {validationResult} from 'express-validator';
import {type Request, type Response, type NextFunction} from 'express';
const validateResult = (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req);
	console.log(errors);
	if (errors.isEmpty()) {
		next();
	}

	res.send({errors: errors.array()});
};

export default validateResult;
