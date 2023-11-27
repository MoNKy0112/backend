import {body, check, param, query} from 'express-validator';
import validateResult from '../utilities/validateHelper';
import {type Request, type NextFunction, type Response} from 'express';

class ValidateProduct {
	public validateCreate = [
		body('name')
			.exists()
			.notEmpty()
			.isString(),
		body('description')
			.exists()
			.notEmpty()
			.isString(),
		body('price')
			.exists()
			.notEmpty()
			.isNumeric(),
		body('imageUrl')
			.exists()
			.notEmpty()
			.isURL(),
		body('stock')
			.exists()
			.notEmpty()
			.isInt(),
		body('discount')
			.exists()
			.notEmpty()
			.isInt(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateUpdate = [
		body('name')
			.optional({checkFalsy: true})
			.notEmpty()
			.isString(),
		body('description')
			.optional({checkFalsy: true})
			.notEmpty()
			.isString(),
		body('price')
			.optional({checkFalsy: true})
			.notEmpty()
			.isNumeric(),
		body('imageUrl')
			.optional({checkFalsy: true})
			.notEmpty()
			.isURL(),
		body('categories')
			.optional({checkFalsy: true})
			.notEmpty()
			.isArray(),
		body('stock')
			.optional({checkFalsy: true})
			.notEmpty()
			.isInt(),
		body('discount')
			.optional({checkFalsy: true})
			.notEmpty()
			.isInt(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateFilter = [
		query('seller_id')
			.optional({checkFalsy: true})
			.isMongoId(),
		query('name')
			.optional({checkFalsy: true})
			.isString(),
		query('priceMin')
			.optional({checkFalsy: true})
			.isNumeric(),
		query('priceMax')
			.optional({checkFalsy: true})
			.isNumeric(),
		query('categories')
			.optional({checkFalsy: true})
			.isArray(),
		query('discountMin')
			.optional({checkFalsy: true})
			.isInt({min: 0, max: 100}),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];
}

export default new ValidateProduct();
