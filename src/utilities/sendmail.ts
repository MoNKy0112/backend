/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import handlebars from 'nodemailer-express-handlebars';
import config from '../config';
import path from 'path';

export type EmailTemplateData = {
	nombre: string;
	url?: string;
};

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: `${process.env.EMAIL_ADDRESS ?? config.EMAIL_ADDRESS}`,
		pass: `${process.env.EMAIL_PASSWORD ?? config.EMAIL_PASSWORD}`,
	},
	from: `TIUN <${process.env.EMAIL_ADDRESS ?? config.EMAIL_ADDRESS}>`,
});

transporter.use('compile', handlebars({
	viewEngine: {
		extname: '.handlebars',
		partialsDir: path.resolve(__dirname, 'mailTemplates'), // Directorio de parciales
		layoutsDir: path.resolve(__dirname, 'mailTemplates'), // Directorio de layouts
		defaultLayout: false, // Layout predeterminado
	},
	viewPath: path.resolve(__dirname, './mailTemplates/'),
}));

export default async function sendMail(email: string, subject: string, template: string, data: EmailTemplateData): Promise<void> {
	const mailOptions = {
		from: 'Tienda Universitaria <tiun2023@gmail.com>',
		to: email,
		subject,
		template,
		context: data,
	};
	console.log(path.resolve(__dirname, 'mailTemplates/'));
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('Error al enviar el correo:', error);
			throw new Error('Error al enviar el correo');
		} else {
			console.log('Correo enviado:', info.response);
		}
	});
}
