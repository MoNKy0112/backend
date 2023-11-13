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
import recommendRoutes from './routes/recommend';
// Settings
app.set('port', config.SERVER_PORT || 3000);
// Midllewares

app.use(cors({
	origin: 'https://ti-un-front-vr3s.vercel.app',
	credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
	res.json({
		message: 'TiUN Backend😊',
	});
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
app.use(recommendRoutes);
export default app;
