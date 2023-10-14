import {type Types, type ObjectId, type UpdateQuery, type QueryOptions} from 'mongoose';
import User, {type IUser} from '../models/User';

class AuthFacade {
	public async saveuser(user: IUser) {
		const newUser = new User(user);
		const savedUser = await newUser.save();
		return savedUser;
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
