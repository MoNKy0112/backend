import {Schema, Types, model, type Document, type Date, type ObjectId} from 'mongoose';

export type IOrder = {
	userId: ObjectId | string;
	sellerId: ObjectId | string;
	products: Array<{
		productId: ObjectId | string;
		quantity: number;
		subtotal: number;
	}>;
	totalAmount: number;
	status: string;
	date: Date;
};

const orderSchema = new Schema({
	userId: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	sellerId: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	products: [
		{
			productId: {type: Types.ObjectId, ref: 'Product', required: true},
			quantity: {type: Number, required: true},
			subtotal: {type: Number, required: true},
		},
	],
	totalAmount: {
		type: Number,
		required: true,
		default: 0,
	},
	status: {
		type: String,
		required: true,
	},
	date: {
		type: Schema.Types.Date,
		required: true,
		default: Date.now,
	},
});

export default model<IOrder & Document>('Order', orderSchema);
