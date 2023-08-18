import {Schema, model, type Document} from 'mongoose';

type IProduct = {
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	categories: string[];
	stock: number;
} & Document;

const productSchema = new Schema({
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
	categories: [{
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
		validate: {
			validator(categories: any[]) {
				return categories.length > 0;
			},
			message: 'Debe seleccionar al menos una categoría.',
		},
	}],
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
});

export default model<IProduct>('Product', productSchema);
