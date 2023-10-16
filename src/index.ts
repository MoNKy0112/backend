import dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import '../src/database';

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
	console.log('server in port 🔥:', port);
});

export default app;
