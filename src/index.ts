import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import './database';

app.listen(app.get('port'), () => {
	console.log('server in port 🔥:', app.get('port'));
});
