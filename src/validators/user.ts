import {body, check, param} from 'express-validator';
import validateResult from '../utilities/validateHelper';
import {type Request, type NextFunction, type Response} from 'express';
class ValidateUser {
	public validateGetById = [
		param('id')
			.exists()
			.notEmpty(),

		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateUpdate = [
		param('cedula')
			.exists()
			.notEmpty(),
		body('name')
			.optional()
			.isString(),
		body('lastname')
			.optional()
			.isString(),
		body('phoneNumber')
			.optional()
			.isString()
			.isLength({min: 10, max: 10})
			.matches(/^[3][0-9]{9}$/)
			.withMessage('El número de teléfono debe comenzar con 3 y tener 10 dígitos numéricos válidos'),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateAddCart = [
		body('product')
			.exists()
			.notEmpty()
			.isMongoId(),
		body('quantity')
			.optional()
			.isNumeric(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateRemoveCart = [
		body('product')
			.exists()
			.notEmpty()
			.isMongoId(),
		body('quantity')
			.optional()
			.isNumeric(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateAddProd = [
		body('products')
			.exists()
			.notEmpty()
			.isArray()
			.withMessage('El campo "product" debe ser un array'),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateRemoveProd = [
		body('products')
			.exists()
			.notEmpty()
			.isArray()
			.withMessage('El campo "product" debe ser un array'),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateAddCat = [
		body('categories')
			.exists()
			.notEmpty()
			.isArray()
			.withMessage('El campo "categories" debe ser un array'),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateRemoveCat = [
		body('categories')
			.exists()
			.notEmpty()
			.isArray()
			.withMessage('El campo "categories" debe ser un array'),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];
}
export default new ValidateUser();
