import express from 'express';
import config from './config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

import authRoutes from './routes/auth';
import orderRoutes from './routes/order';
import userRoutes from './routes/user';
import productRoutes from './routes/product';
import categoriesRoutes from './routes/category';
import mercadopagoRoutes from './routes/mercadopago';
import path from 'path';
import {url} from 'inspector';
import recommendRoutes from './routes/recommend';
// Settings
app.set('port', config.SERVER_PORT || 3000);
// Midllewares

app.use(cors({
	origin: 'https://ti-un-front-vr3s.vercel.app',
	credentials: true,
}));
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src/public')));
app.use(cookieParser());

app.get('/', (req, res) => {
	res.json({
		message: 'TiUN Backend😊',
	});
});

app.get('/oauthmp', (req, res) => {
	res.json({body: req.body, code: url});
});

app.get('/oauth', (req, res) => {
	res.json('https://auth.mercadopago.com/authorization?client_id=4999751880735799&response_type=code&platform_id=mp&state=000011&redirect_uri=https://backend-y8aq.vercel.app/oauthmp');
});

app.get('/set-cookie', (req, res) => {
	try {
		// Intenta configurar la cookie
		res.cookie('mi-cookie', 'mi-valor', {
			secure: true, // Solo se envía a través de conexiones HTTPS
			httpOnly: true, // No es accesible desde JavaScript en el navegador
			sameSite: 'lax', // Ajusta esto según tus necesidades
		});

		// Envía una respuesta de éxito si la cookie se configuró correctamente
		res.send('Cookie configurada con éxito');
	} catch (error) {
		// Maneja cualquier error que pueda ocurrir al configurar la cookie
		console.error('Error al configurar la cookie:', error);
		// Envía una respuesta de error al cliente
		res.status(500).send('Error al configurar la cookie');
	}
});

// Routes
app.use(authRoutes);
app.use(orderRoutes);
app.use(userRoutes);
app.use(productRoutes);
app.use(categoriesRoutes);
app.use(mercadopagoRoutes);
app.use(recommendRoutes);
export default app;
