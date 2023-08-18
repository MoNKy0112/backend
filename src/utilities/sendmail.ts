import {error} from 'console';
import nodemailer from 'nodemailer';

export const sendMail	= async (email: string, data: any) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: `${process.env.EMAIL_ADDRESS}`,
			pass: `${process.env.EMAIL_PASSWORD}`,
		},
	});

	const mailOptions = {
		from: 'test@gmail.com',
		to: `${email}`,
		subject: 'Reset Password',
		text: data.verificationLink as string,
	};

	transporter.sendMail(mailOptions, (err: any, data: any) => {
		if (err) {
			console.log('Error occurs', err);
			error('Error');
		}

		console.log('Email sent!!!');
		return 'Email sent';
	});
};
