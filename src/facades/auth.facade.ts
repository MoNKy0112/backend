import User, {type IUser} from '../models/User';

class AuthFacade {
	public async saveuser(user: IUser) {
		try {
			const newUser = new User(user);
			if (!newUser) throw new Error('Error when creating user');
			const savedUser = await newUser.save();
			if (!savedUser) throw new Error('Error when saving user');
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
			if (!user) throw new Error('Error validating the user');
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to validate user');
			}
		}
	}

	public async verifyEmail(userId: string) {
		try {
			const user = await User.findByIdAndUpdate(userId, {emailVerified: true}, {new: true});
			if (!user) throw new Error('error when trying to verify the user');
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				throw new Error('Unknown error when trying to verify the user');
			}
		}
	}

	public async getuser(userId: string) {
		try {
			const user = await User.findById(userId);
			if (!user) throw new Error('error when trying to get the user');
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
			if (!user) throw new Error('error when trying to update the user');
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
