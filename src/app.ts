import express from 'express';
import config  from './config';
import morgan from 'morgan';
const app = express();

import authRoutes from './routes/auth';


//settings
app.set('port', config.SERVER_PORT);

//midllewares
app.use(morgan('dev'))
app.use(express.json())

//routes
app.use(authRoutes)

export default app;