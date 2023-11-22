import {Schema, model, type Document} from 'mongoose';

export type ITask = {
	orderId: string | Schema.Types.ObjectId;
	date: Date;
};

const taskSchema = new Schema({
	orderId: {
		type: String || Schema.Types.ObjectId,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
});

export default model<ITask & Document>('Task', taskSchema);
