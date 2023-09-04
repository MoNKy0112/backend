import {Schema, Types, model, type Document} from 'mongoose';

export type IOrder = {
	userId: Types.ObjectId;
	sellerId: Types.ObjectId;
	products: Array<{
		productId: Types.ObjectId;
		quantity: number;
		subtotal: number;
	}>;
	totalAmount: number;
	status: string;
} & Document;

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
	},
	status: {
		type: String,
		required: true,
	},
});

export default model<IOrder>('Order', orderSchema);
