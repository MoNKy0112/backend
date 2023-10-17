import {type Request, type Response} from 'express';
import sendMail, {type EmailTemplateData} from '../utilities/sendmail';
import User, {type IUser} from '../models/User';
import authFacade from '../facades/auth.facade';
import {hash} from '../utilities/hash';

import jwt from 'jsonwebtoken';
import {type ObjectId} from 'mongoose';
import token from '../utilities/token';

export const signUp = async (req: Request, res: Response) => {
	try {
		// Guardar Usuario
		const user: IUser = new User({
			lastname: req.body.lastname as string,
			email: req.body.email as string,
			password: req.body.password as string,
			name: req.body.username as string,
			id_cedula: req.body.id_cedula as string,
			phoneNumber: req.body.phoneNumber as string,
			imageUrl: req.body.imageUrl as string,
			termsandconditions: req.body.aceptarTerminos as boolean,
			createdat: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
			updatedat: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
		});
		user.password = await user.encryptPassword(user.password);
		console.log(user);
		const savedUser = await authFacade.saveuser(user);
		// Token
		const accessToken = await token.generateAccessToken({_id: user._id as ObjectId});
		const refreshToken = await token.generateRefreshToken({_id: user._id as ObjectId});

		res.cookie('authToken', accessToken, {
			maxAge: 3600000, // Duración de 1 hora
			secure: true, // Solo se envía a través de conexiones HTTPS
			httpOnly: true, // No es accesible desde JavaScript en el navegador
			path: '/', // Disponible en todas las rutas
			domain: process.env.NODE_ENV === 'development' ? '.localhost' : 'backend-6fx2.vercel.app',
		}).cookie('refreshToken', refreshToken, {
			maxAge: 3600000, // Duración de 1 hora
			secure: true, // Solo se envía a través de conexiones HTTPS
			httpOnly: true, // No es accesible desde JavaScript en el navegador
			path: '/', // Disponible en todas las rutas
			domain: process.env.NODE_ENV === 'development' ? '.localhost' : 'backend-6fx2.vercel.app',
		}).json({savedUser, accessToken, refreshToken});
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error during register:', error.message);
			res.status(400).json(error.message);
		} else {
			console.error('Unknown error during register:', error);
			res.status(500).json('An unknown error occurred.');
		}
	}
};

export const signIn = async (req: Request, res: Response) => {
	try {
		const user = await authFacade.validateuser(req.body.email as string);

		if (!user) {
			throw new Error('Email is wrong'); // Lanzar una excepción en lugar de devolver un mensaje directamente
		}

		const correctPassword: boolean = await user.validatePassword(req.body.password as string);
		if (!correctPassword) {
			throw new Error('Password is wrong'); // Lanzar una excepción en lugar de devolver un mensaje directamente
		}

		const accessToken = await token.generateAccessToken({_id: user._id as ObjectId});
		const refreshToken = await token.generateRefreshToken({_id: user._id as ObjectId});

		res.cookie('authToken', accessToken, {
			maxAge: 3600000, // Duración de 1 hora
			secure: true, // Solo se envía a través de conexiones HTTPS
			httpOnly: true, // No es accesible desde JavaScript en el navegador
			path: '/', // Disponible en todas las rutas
			domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.vercel.app',
		}).cookie('refreshToken', refreshToken, {
			maxAge: 3600000, // Duración de 1 hora
			secure: true, // Solo se envía a través de conexiones HTTPS
			httpOnly: true, // No es accesible desde JavaScript en el navegador
			path: '/', // Disponible en todas las rutas
			domain: '.vercel.app',
			sameSite: 'none',
		}).cookie('refreshToken1', refreshToken, {
			maxAge: 3600000, // Duración de 1 hora
			secure: true, // Solo se envía a través de conexiones HTTPS
			httpOnly: true, // No es accesible desde JavaScript en el navegador
			domain: '.vercel.app',
			sameSite: 'none',
		}).json({user, accessToken, refreshToken});
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error during login:', error.message);
			res.status(400).json(error.message);
		} else {
			console.error('Unknown error during login:', error);
			res.status(500).json('An unknown error occurred.');
		}
	}
};

export const profile = async (req: Request, res: Response) => {
	try {
		console.log(req.userId);
		const user = await authFacade.getuser(req.userId);
		if (!user) throw new Error('User not found!');
		res.json(user);
	} catch (error) {
		res.json(error);
	}
};

export const requestPasswordReset = async (req: Request, res: Response) => {
	try {
		const user = await authFacade.validateuser(req.body.email as string);
		if (!user) throw new Error('User not found!');
		// ENVIAR MAIL
		const token: string = jwt.sign(
			{_id: user._id as ObjectId},
			process.env.TOKEN_SECRET_RESET ?? 'resettokentest',
			{
				expiresIn: 60 * 5,
			},
		);
		const verificationLink = `http://localhost:${
			process.env.PORT ?? '8080'
		}/reconfirm_password?reset_token=${token}`;
		const data: EmailTemplateData = {
			nombre: req.body.name as string,
			url: verificationLink,
		};
		// Data mail y enviarlo
		await sendMail(req.body.email as string, 'reset Password', 'resetPassword', data);
		// Res.status(200).json('Email enviado')
		res.status(200).json(token);
		console.log(token);
	} catch (error) {
		res.status(400).json(error);
	}
};

export const passwordReset = async (req: Request, res: Response) => {
	const secPassword = await hash(req.body.newpassword as string);
	const user = await authFacade.updateuser(req.userId, secPassword);

	const newuser = await authFacade.getuser(req.userId);
	console.log(newuser);
	res.status(200).json(user);
};
