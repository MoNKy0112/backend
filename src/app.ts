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
// Settings
app.set('port', config.SERVER_PORT);

// Midllewares
app.use(cors({
	origin: 'http://localhost:5173',
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(authRoutes);
app.use(orderRoutes);
app.use(userRoutes);
app.use(productRoutes);

export default app;
