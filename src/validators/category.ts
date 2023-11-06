import {body, check, param} from 'express-validator';
import validateResult from '../utilities/validateHelper';
import {type Request, type NextFunction, type Response} from 'express';

class ValidateCategory {
	public validateCreate = [
		body('name')
			.exists()
			.notEmpty()
			.isString()
			.withMessage('El nombre del producto es obligatorio'),
		body('description')
			.exists()
			.notEmpty()
			.isString()
			.isLength({max: 256})
			.withMessage('La descripcion debe tener maximo 256 caracteres'),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateUpdate = [
		param('categoryId')
			.exists(),
		body('name')
			.optional()
			.isString()
			.notEmpty(),
		body('description')
			.optional()
			.isString()
			.notEmpty()
			.isLength({max: 256})
			.withMessage('La descripcion debe tener maximo 256 caracteres'),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];
}

export default new ValidateCategory();
