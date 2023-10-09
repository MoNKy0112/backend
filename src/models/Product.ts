import {Schema, model, type Document, Types, type Date, now} from 'mongoose';

export type IProduct = {
	sellerId: Schema.Types.ObjectId;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	categories: Schema.Types.ObjectId[];
	stock: number;
	discount: number;
	ratings: number;
	ratingsCount: number;
	createdat: Date;
	updatedat: Date;
} & Document;

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
	ratings: {
		type: Number,
		min: 0,
		max: 5,
		default: 0, // Inicialmente, el promedio de calificaciones es 0.
	},
	ratingsCount: {
		type: Number,
		default: 0,
	},
	createdat: {
		type: Date,
		require: true,
	},
	updatedat: {
		type: Date,
		require: true,
	},
});

export default model<IProduct>('Product', productSchema);
