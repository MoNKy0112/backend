import bcrypt from 'bcryptjs';

export async function hash(strToHash: string): Promise<string> {
	const key = await bcrypt.hash(strToHash, await bcrypt.genSalt(10));
	return key;
}
