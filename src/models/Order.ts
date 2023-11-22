import {Schema, Types, model, type Document, type ObjectId} from 'mongoose';

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
	preferenceId: string;
	expireDate?: Date;
};

export type IPayItem = {
	id: string;
	title: string;
	quantity: number;
	currency_id: string;
	unit_price: number;
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
	preferenceId: {
		type: String,
		required: false,
		unique: true,
	},
	expireDate: {
		type: Schema.Types.Date,
		required: true,
		default: new Date(Date.now() + (3 * 60 * 60 * 1000)),
	},
});

export default model<IOrder & Document>('Order', orderSchema);
