import {type Request, type Response} from 'express';
import sendMail, {type EmailTemplateData} from '../utilities/sendmail';
import User, {type IUser} from '../models/User';
import {hash} from '../utilities/hash';

import jwt from 'jsonwebtoken';
import {type ObjectId} from 'mongoose';
import token from '../utilities/token';

export const signUp = async (req: Request, res: Response) => {
	try {
		// Guardar Usuario
		const user: IUser = new User({
			name: req.body.username as string,
			lastname: req.body.lastname as string,
			email: req.body.email as string,
			password: req.body.password as string,
			id_cedula: req.body.id_cedula as string,
			phoneNumber: req.body.phoneNumber as string,
		});
		user.password = await user.encryptPassword(user.password);
		const savedUser = await user.save();
		// Token
		const accessToken = await token.generateAccessToken({_id: user._id as ObjectId});
		const refreshToken = await token.generateRefreshToken({_id: user._id as ObjectId});

		res.cookie('authToken', accessToken)
			.cookie('refreshToken', refreshToken)
			.json({savedUser, accessToken, refreshToken});
	} catch (error) {
		res.status(500).json({error: 'Error al crear el usuario'});
	}
};

export const signIn = async (req: Request, res: Response) => {
	try {
		const user = await User.findOne({email: req.body.email as string});

		if (!user) {
			throw new Error('Email is wrong'); // Lanzar una excepción en lugar de devolver un mensaje directamente
		}

		const correctPassword: boolean = await user.validatePassword(req.body.password as string);
		if (!correctPassword) {
			throw new Error('Password is wrong'); // Lanzar una excepción en lugar de devolver un mensaje directamente
		}

		const accessToken = await token.generateAccessToken({_id: user._id as ObjectId});
		const refreshToken = await token.generateRefreshToken({_id: user._id as ObjectId});

		res.cookie('authToken', accessToken)
			.cookie('refreshToken', refreshToken)
			.json({user, accessToken, refreshToken});
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
		const user = await User.findById(req.userId);
		if (!user) throw new Error('User not found!');
		res.json(user);
	} catch (error) {
		res.json(error);
	}
};

export const requestPasswordReset = async (req: Request, res: Response) => {
	try {
		const user = await User.findOne({email: req.body.email as string});
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
			process.env.PORT ?? '3000'
		}/password-reset?reset_token=${token}`;
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
	await User.updateOne(
		{_id: req.userId},
		{$set: {password: secPassword}},
		{new: true},
	);

	const user = await User.findById(req.userId);
	console.log(user);
	res.status(200).json(user);
};
