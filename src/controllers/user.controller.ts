import {type Request, type Response} from 'express';
import userFacade from '../facades/user.facade';

class UserController {
	public async getUsers(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.getUsers(req, res);
	}

	public async updateUser(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.updateUser(req, res);
	}

	public async deleteUser(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.deleteUser(req, res);
	}
}

export default new UserController();
