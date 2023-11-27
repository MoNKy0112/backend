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
			.optional()
			.notEmpty()
			.isString(),
		body('description')
			.optional()
			.notEmpty()
			.isString(),
		body('price')
			.optional()
			.notEmpty()
			.isNumeric(),
		body('imageUrl')
			.optional()
			.notEmpty()
			.isURL(),
		body('categories')
			.optional()
			.notEmpty()
			.isArray(),
		body('stock')
			.optional()
			.notEmpty()
			.isInt(),
		body('discount')
			.optional()
			.notEmpty()
			.isInt(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateFilter = [
		query('seller_id')
			.optional()
			.isMongoId(),
		query('name')
			.optional()
			.isString(),
		query('priceMin')
			.optional()
			.isNumeric(),
		query('priceMax')
			.optional()
			.isNumeric(),
		query('categories')
			.optional()
			.isArray(),
		query('discountMin')
			.optional()
			.isInt({min: 0, max: 100}),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];
}

export default new ValidateProduct();
