import {Schema, model, type Document} from 'mongoose';

export type ICategory = {
	name: string;
	description: string;
};

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

export default model<ICategory & Document>('Category', categorySchema);
