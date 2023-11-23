import dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import '../src/database';
import task from './utilities/task';
const port = process.env.PORT ?? 3000;

app.listen(port, async () => {
	await task.startWithServer();
	await task.start();
	console.log('server in port 🔥:', port);
});

export default app;
