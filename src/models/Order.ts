import {Schema, model, type Document} from 'mongoose';

type IOrder = {
	userId: string;
	products: Array<{
		productId: string;
		quantity: number;
		subtotal: number;
	}>;
	totalAmount: number;
	status: string;
} & Document;

const orderSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	products: [
		{
			productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
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
