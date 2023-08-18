import bcrypt from 'bcryptjs';

export const hash = async (strToHash: string) => {
	const key = await bcrypt.hash(strToHash, await bcrypt.genSalt(10));
	return key;
};
