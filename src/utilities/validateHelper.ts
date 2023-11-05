import {validationResult} from 'express-validator';
import {type Request, type Response, type NextFunction} from 'express';
const validateResult = (req: Request, res: Response, next: NextFunction) => {
	const result = validationResult(req);

	if (!result.isEmpty()) {
		return res.send({errors: result.array()});
	}

	next();
};

export default validateResult;
