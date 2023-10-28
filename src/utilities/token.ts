import jwt, {type JwtPayload} from 'jsonwebtoken';
import {type ObjectId} from 'mongoose';

type Ipayload = {
	_id: string | ObjectId;
};
class Jwtoken {
	private readonly accessKey: string;
	private readonly refreshKey: string;
	private readonly resetKey: string;

	constructor() {
		this.accessKey = process.env.TOKEN_SECRET ?? 'TOKEN_SECRET';
		this.refreshKey = process.env.REFRESH_TOKEN_SECRET ?? 'REFRESH_TOKEN_SECRET';
		this.resetKey = process.env.TOKEN_SECRET_RESET ?? 'TOKEN_SECRET_RESET';
	}

	public async generateAccessToken(payload: Ipayload, expTime?: string | number): Promise<string> {
		return this.generate(payload, this.accessKey, expTime ?? 60 * 15);
	}

	public async generateRefreshToken(payload: Ipayload, expTime?: string | number): Promise<string> {
		return this.generate(payload, this.refreshKey, expTime ?? 60 * 60 * 24 * 30);
	}

	public async generateResetPasswordToken(payload: Ipayload, expTime?: string | number): Promise<string> {
		return this.generate(payload, this.refreshKey, expTime ?? 60 * 60);
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
