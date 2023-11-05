import {type Types, type ObjectId, type UpdateQuery, type QueryOptions} from 'mongoose';
import User, {type IUser} from '../models/User';

class AuthFacade {
	public async saveuser(user: IUser) {
		try {
			const newUser = new User(user);
			if (!newUser) throw new Error('error al crear usuario');
			const savedUser = await newUser.save();
			if (!savedUser) throw new Error('error al guardar usuario');
			return savedUser;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error when trying to save user');
			}
		}
	}

	public async validateuser(email: string) {
		const user = await User.findOne({email});
		return user;
	}

	public async getuser(userId: string) {
		const user = User.findById(userId);
		return user;
	}

	public async updateuser(userId: string, secPassword: string) {
		await User.updateOne(
			{_id: userId},
			{$set: {password: secPassword}},
			{new: true},
		);
	}
}

export default new AuthFacade();
