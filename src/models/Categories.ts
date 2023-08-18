import {Schema, model, type Document} from 'mongoose';

type ICategory = {
	name: string;
	description: string;
} & Document;

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
});

export default model<ICategory>('Category', categorySchema);
