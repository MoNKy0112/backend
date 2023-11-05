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
				throw new Error('Unknown error when trying to save user');
			}
		}
	}

	public async validateuser(email: string) {
		try {
			const user = await User.findOne({email});
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to validate user');
			}
		}
	}

	public async getuser(userId: string) {
		try {
			const user = await User.findById(userId);
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to get user');
			}
		}
	}

	public async updateuser(userId: string, secPassword: string) {
		try {
			const user = await User.updateOne(
				{_id: userId},
				{$set: {password: secPassword}},
				{new: true},
			);
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to update user');
			}
		}
	}
}

export default new AuthFacade();
