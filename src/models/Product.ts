import {Schema, model, type Document} from 'mongoose';
import User from './User';

export type IProduct = {
	sellerId: Schema.Types.ObjectId | string;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	categories: Schema.Types.ObjectId[] | string[];
	stock: number;
	discount: number;
	solds: number;
	createdat: Date;
	updatedat: Date;
};

const productSchema = new Schema({
	sellerId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	categories: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
	],
	stock: {
		type: Number,
		required: true,
	},
	discount: {
		type: Number,
		required: true,
		validate: {
			validator(discount: number) {
				return discount >= 0 && discount <= 100;
			},
			message: 'Debe seleccionar un valor entre 0 y 100',
		},
	},
	solds: {
		type: Number,
		required: true,
		default: 0,
	},
	createdat: {
		type: Schema.Types.Date,
		required: true,
	},
	updatedat: {
		type: Schema.Types.Date,
		required: true,
	},
});

export default model<IProduct & Document>('Product', productSchema);

productSchema.pre<IProduct & Document>('findOneAndDelete', async function (this: IProduct & Document, next) {
	try {
		// Elimié esta línea ya que no estaba completa y no es necesaria para el hook pre-remove
		// const usuarios = await User.find({ favoriteProducts: this. });

		// El hook pre-remove debe actuar solo en la instancia actual del producto
		const usuarios = await User.find({favoriteProducts: this._id as string});

		await Promise.all(
			usuarios.map(async usuario => {
				// Filtrar y asignar el nuevo array de strings
				usuario.favoriteProducts = usuario.favoriteProducts.filter(
					productId => String(productId) !== String(this._id),
				) as string[];

				await usuario.save();
			}),
		);

		next();
	} catch (error) {
		// Maneja el error de manera apropiada, por ejemplo, registrándolo o lanzándolo nuevamente
		console.error(error);
		next();
	}
});
