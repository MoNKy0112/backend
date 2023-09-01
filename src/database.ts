
import mongoose from 'mongoose';
import config from './config';

(async () => {
	try {
		const db = await mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.rp4kw2r.mongodb.net/?retryWrites=true&w=majority`);
		console.log('database ', db.connection.name, ' connected');
	} catch (error) {
		console.log(error);
	}
})();

