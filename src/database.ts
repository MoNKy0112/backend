import mongoose from 'mongoose';
import config from './config';

(async () => {
	try {
		const db = await mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.ztqce77.mongodb.net/?retryWrites=true&w=majority`);
		console.log('Conexión a la base de datos:', db.connection.name, 'exitosa');
	} catch (error) {
		console.error('Error en la conexión a la base de datos:', error);
	}
})();
