import {type Request, type Response} from 'express';
import UserFacade from '../facades/user.facade';

class UserController {
	public async getUsers(req: Request, res: Response): Promise<Response | undefined> {
		return UserFacade.getUsers(req, res);
	}

	public async updateUser(req: Request, res: Response): Promise<Response | undefined> {
		return UserFacade.updateUser(req, res);
	}

	public async deleteUser(req: Request, res: Response): Promise<Response | undefined> {
		return UserFacade.deleteUser(req, res);
	}
}

export default new UserController();
