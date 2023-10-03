import {type Request, type Response} from 'express';
import User, {type IUser} from '../models/User';

class UserFacade {
	public async getUsers(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const users = await User.find();
			return res.status(200).json(users);
		} catch (error) {
			console.error('Error obteniendo los usuarios:', error);
			res.status(500).json({error: 'Error interno del servidor'});
		}
	}

	public async updateUser(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const cedulaToUpdate = req.params.cedula;
			const {name, lastname, phoneNumber} = req.body as IUser;
			const updatedUserFields = {
				name,
				lastname,
				phoneNumber,
			};

			const updatedUser = await User.findOneAndUpdate(
				{id_cedula: cedulaToUpdate},
				updatedUserFields,
				{new: true},
			);

			if (!updatedUser) {
				return res.status(404).json({error: 'Usuario no encontrado'});
			}

			res.json(updatedUser);
		} catch (error) {
			res.status(500).json({error: 'Error al actualizar el usuario'});
		}
	}

	public async deleteUser(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const cedulaToDelete = req.params.cedula;
			const deletedUser = await User.findOneAndDelete({
				id_cedula: cedulaToDelete,
			});
			if (!deletedUser) {
				return res.status(404).json({error: 'Usuario no encontrado'});
			}

			res.json({message: 'Usuario eliminado exitosamente'});
		} catch (error) {
			res.status(500).json({error: 'Error al eliminar el usuario'});
		}
	}
}

export default new UserFacade();
