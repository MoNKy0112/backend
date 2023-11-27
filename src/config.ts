/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from 'dotenv';
dotenv.config();

export default {
	MONGO_DATABASE: 'test2',
	MONGO_USER: 'TiUN2023',
	MONGO_PASSWORD: 'TiendaUNAL2023',
	MONGO_HOST: '127.0.0.1:27017',
	SERVER_PORT: process.env.PORT ?? 3000,
	EMAIL_ADDRESS: 'tiun2023@gmail.com',
	EMAIL_PASSWORD: 'spckusbymxxijcpj',
	FRONT_URL: 'https://ti-un-front-vr3s.vercel.app',
	TIUN_CLIENT_ID: '4999751880735799',
	TIUN_CLIENT_SECRET: 'omjcA6FaAhtTlZrAjAEKZbBzI5jcLy0d',
	REDIRECT_URI: 'https://ti-un-front-vr3s.vercel.app/accountSucces',
};
