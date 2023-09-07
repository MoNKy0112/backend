import {type Request, type Response} from 'express';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find(); // Retrieve all users from the 'User' collection
		res.status(200).json(users); // Send the users as a JSON response
	  } catch (error) {
		console.error('Error obteniendo los usuarios:', error);
		res.status(500).json({ error: 'Error interno del servidor' }); // Handle and respond with an error
	  }
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const cedulaToUpdate = req.params.cedula;
		const {name, lastname, phoneNumber} = req.body;
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
};

export const deleteUser = async (req: Request, res: Response) => {
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
};

