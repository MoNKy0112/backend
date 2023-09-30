import jwt, {type JwtPayload} from 'jsonwebtoken';
import {type ObjectId} from 'mongoose';

type Ipayload = {
	_id: string | ObjectId;
};
class Jwtoken {
	private readonly accessKey: string;
	private readonly refreshKey: string;

	constructor() {
		this.accessKey = process.env.TOKEN_SECRET ?? '';
		this.refreshKey = process.env.REFRESH_TOKEN_SECRET ?? '';
	}

	public async generateAccessToken(payload: Ipayload): Promise<string> {
		return this.generate(payload, this.accessKey, 60 * 15);
	}

	public async generateRefreshToken(payload: Ipayload): Promise<string> {
		return this.generate(payload, this.refreshKey, 60 * 60 * 24 * 7);
	}

	private async generate(payload: JwtPayload, key: string, expiresIn: string | number | undefined): Promise<string> {
		try {
			return jwt.sign(payload, key, {expiresIn});
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Error al generar el token: ${error.message}`);
			} else {
				throw new Error('error desconocido');
			}
		}
	}
}

export default new Jwtoken();
