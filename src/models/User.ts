import {Schema, model, type Document, type ObjectId} from 'mongoose';
import bcrypt from 'bcryptjs';

type CartProduct = {
	productId: ObjectId | string;
	productName: string;
	productImageUrl: string;
	quantity: number;
	subtotal: number;
};

type Cart = {
	sellerId: ObjectId | string;
	products: CartProduct[];
};

export type IUser = {
	name: string;
	lastname: string;
	email: string;
	password: string;
	id_cedula: string;
	phoneNumber: string;
	isAdmin: boolean;
	emailVerified: boolean;
	createdat: Date;
	updatedat: Date;
	imageUrl: string;
	favoriteCategories: ObjectId[] | string[];
	favoriteProducts: ObjectId[] | string[];
	cart: Cart[];
	encryptPassword(password: string): Promise<string>;
	validatePassword(password: string): Promise<boolean>;

} & Document;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		min: 4,
		lowercase: true,
	},
	lastname: {
		type: String,
		required: true,
		min: 4,
		lowercase: true,
	},
	id_cedula: {
		type: String,
		required: true,
		unique: true,
		min: 4,
		lowercase: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: false,
	},
	favouriteCategories: [{
		type: Schema.Types.ObjectId,
		ref: 'Categories',
	}],
	favouriteProducts: [{
		type: Schema.Types.ObjectId,
		ref: 'Product',
	}],
	orders: [{
		type: Schema.Types.ObjectId,
		ref: 'Order',
	}],
	cart: [
		{
			sellerId: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
			products: [
				{
					productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
					productName: {type: String, required: true},
					productImageUrl: {type: String, required: true},
					quantity: {type: Number, required: true},
					subtotal: {type: Number, required: true},
				},
			],
		},
	],
	isAdmin: {
		type: Boolean,
		default: false,
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
	termsandconditions: {
		type: Boolean,
		default: false,
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

userSchema.methods.encryptPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
	return bcrypt.compare(password, this.password as string);
};

export default model<IUser>('User', userSchema);
