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
// Settings
app.set('port', config.SERVER_PORT || 3000);
const allowedOrigins = ['https://ti-un-front-fork.vercel.app', 'http://localhost:8080'];

// Midllewares
app.use(cors({
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
	res.json({
		message: 'TiUN Backend😊',
	});
});

// Routes
app.use(authRoutes);
app.use(orderRoutes);
app.use(userRoutes);
app.use(productRoutes);
app.use(categoriesRoutes);
export default app;
