import {type Request, type Response} from 'express';
import {sendMail} from '../utilities/sendmail';
import User, {type IUser} from '../models/User';
import {hash} from '../utilities/hash';

import jwt from 'jsonwebtoken';
import {type ObjectId} from 'mongoose';

export const signUp = async (req: Request, res: Response) => {
	// Guardar Usuario
	const user: IUser = new User({
		username: req.body.username as string,
		email: req.body.email as string,
		password: req.body.password as string,
	});
	user.password = await user.encryptPassword(user.password);
	const savedUser = await user.save();
	// Token
	const token: string = jwt.sign(
		{_id: savedUser._id as ObjectId},
		process.env.TOKEN_SECRET ?? 'tokentest',
	);

	res.cookie('auth-token', token).json(savedUser);
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

		const key = process.env.TOKEN_SECRET ?? 'tokentest';

		const accessToken: string = jwt.sign({_id: user._id as ObjectId}, key, {
			expiresIn: 60 * 15,
		});
		const refreshToken: string = jwt.sign({_id: user._id as ObjectId}, key, {
			expiresIn: 60 * 60 * 24 * 7,
		});

		res.cookie('authToken', accessToken, {httpOnly: true, secure: true, sameSite: 'strict'});
		res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true, sameSite: 'strict'});
		res.json({user, accessToken, refreshToken});
	} catch (error) {
		console.error('Error during login:', error);
		res.status(400).json(error); // Devolver el mensaje de error en la respuesta
	}
};

export const profile = async (req: Request, res: Response) => {
	const user = await User.findById(req.userId);
	if (!user) return res.status(404).json('User not found!');
	res.json(user);
};

export const requestPasswordReset = async (req: Request, res: Response) => {
	const user = await User.findOne({email: req.body.email as string});
	if (!user) return res.status(400).json('Email is wrong');

	// ENVIAR MAIL
	const token: string = jwt.sign(
		{_id: user._id as ObjectId},
		process.env.TOKEN_SECRET_RESET ?? 'resettokentest',
		{
			expiresIn: 60 * 5,
		},
	);

	const verificationLink = `http//localhost:${
		process.env.PORT ?? '3000'
	}/resetpassword/token=${token}`;
	// Data mail y enviarlo

	await sendMail(req.body.email as string, {verificationLink});

	// Res.status(200).json('Email enviado')
	res.status(200).json(token);
	console.log(token);
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
