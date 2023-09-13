import dotenv from 'dotenv'
dotenv.config()

export default {
	MONGO_DATABASE: 'test2',
	MONGO_USER: 'TiUN2023',
	MONGO_PASSWORD: 'TiendaUNAL2023',
	MONGO_HOST: '127.0.0.1:27017',
	SERVER_PORT: process.env.PORT ?? 3000,
	EMAIL_ADDRESS: 'tiun2023@gmail.com',
	EMAIL_PASSWORD: 'spckusbymxxijcpj',
};
