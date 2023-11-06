import {Schema, model, type Document} from 'mongoose';

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
		require: true,
	},
	updatedat: {
		type: Schema.Types.Date,
		require: true,
	},
});

export default model<IProduct & Document>('Product', productSchema);
