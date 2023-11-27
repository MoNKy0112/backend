import {type ValidationChain, body, check, param} from 'express-validator';
import validateResult from '../utilities/validateHelper';
import {type Request, type NextFunction, type Response} from 'express';
class ValidateAuth {
	public validateSignUp = [
		body('lastname')
			.exists()
			.isString()
			.notEmpty(),
		body('email')
			.exists()
			.isString()
			.notEmpty()
			.isEmail()
			.custom((value: string) => {
				if (!value.endsWith('@unal.edu.co')) {
					throw new Error('El parámetro debe ser una dirección de correo de @unal.edu.co');
				}

				return true;
			})
			.withMessage('El parámetro debe ser una dirección de correo de @unal.edu.co válida'),
		body('password')
			.exists()
			.isString()
			.notEmpty(),
		body('username')
			.exists()
			.isString()
			.notEmpty(),
		body('id_cedula')
			.exists()
			.isString()
			.notEmpty(),
		body('phoneNumber')
			.exists()
			.notEmpty()
			.isMobilePhone('es-CO')
			.withMessage('El número de teléfono no es válido en Colombia'),
		body('termsandconditions')
			.exists()
			.isBoolean()
			.notEmpty(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateSignIn = [
		body('email')
			.exists()
			.isString()
			.notEmpty()
			.isEmail()
			.custom((value: string) => {
				if (!value.endsWith('@unal.edu.co')) {
					throw new Error('El parámetro debe ser una dirección de correo de @unal.edu.co');
				}

				return true;
			})
			.withMessage('El parámetro debe ser una dirección de correo de @unal.edu.co válida'),
		body('password')
			.exists()
			.isString()
			.notEmpty(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateResetPassword = [
		body('email')
			.exists()
			.isString()
			.notEmpty()
			.isEmail()
			.custom((value: string) => {
				if (!value.endsWith('@unal.edu.co')) {
					throw new Error('El parámetro debe ser una dirección de correo de @unal.edu.co');
				}

				return true;
			})
			.withMessage('El parámetro debe ser una dirección de correo de @unal.edu.co válida'),
		body('name')
			.exists()
			.isString()
			.notEmpty(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];

	public validateNewPassword = [
		body('newpassword')
			.exists()
			.isString()
			.notEmpty(),
		(req: Request, res: Response, next: NextFunction) => {
			validateResult(req, res, next);
		},
	];
}

export default new ValidateAuth();
