// ErrorHandler.ts
import type {ValidationError} from './errors';
import {type Response} from 'express';

type ErrorHandler = Record<string, (error: Error, res: Response) => void>;

const errorHandler: ErrorHandler = {
	validationError(error, res) {
		const validationError = error as ValidationError;
		console.error('Validation Error:', validationError.message);
		console.error('Field:', validationError.field);
		// Respondes con un código 422 Unprocessable Entity para errores de validación
		res.status(422).json({error, field: validationError.field});
	},
	connectionError(error, res) {
		console.error('Connection Error:', error.message);
		// Respondes con un código 503 Service Unavailable para errores de conexión
		res.status(503).json({error: 'Connection failed'});
	},
	productNotFoundError(error, res) {
		console.error('Product Not Found Error:', error.message);
		// Respondes con un código 404 Not Found para errores de producto no encontrado
		res.status(404).json({error: 'Product not found'});
	},
	userNotFoundError(error, res) {
		console.error('User Not Found Error:', error.message);
		// Respondes con un código 404 Not Found para errores de usuario no encontrado
		res.status(404).json({error: 'User not found'});
	},
	insufficientStockError(error, res) {
		console.error('Insufficient Stock Error:', error.message);
		// Respondes con un código 400 Bad Request u otro código según tus necesidades
		res.status(400).json({error: 'Insufficient stock'});
	},
	emptyCartError(error, res) {
		console.error('Empty Cart Error:', error.message);
		// Respondes con un código 400 Bad Request u otro código según tus necesidades
		res.status(400).json({error: 'The shopping cart is empty'});
	},
	paymentError(error, res) {
		console.error('Payment Error:', error.message);
		// Respondes con un código 500 Internal Server Error u otro código según tus necesidades
		res.status(500).json({error: 'Payment processing error'});
	},
	orderCreationError(error, res) {
		console.error('Order Creation Error:', error.message);
		// Respondes con un código 500 Internal Server Error u otro código según tus necesidades
		res.status(500).json({error: 'Order creation failed'});
	},
	orderNotFoundError(error, res) {
		console.error('Order Not Found Error:', error.message);
		// Respondes con un código 404 Not Found para errores de orden no encontrado
		res.status(404).json({error: 'Order not found'});
	},
	duplicateUserError(error, res) {
		console.error('Duplicate User Error:', error.message);
		// Respondes con un código 409 Conflict u otro código según tus necesidades
		res.status(409).json({error: 'User with the same credentials already exists'});
	},
	apiError(error, res) {
		console.error('API Error:', error.message);
		// Respondes con un código 500 Internal Server Error u otro código según tus necesidades
		res.status(500).json({error: 'External API error'});
	},
	authenticationError(error, res) {
		console.error('Authentication Error:', error.message);
		// Respondes con un código 401 Unauthorized para errores de autenticación
		res.status(401).json({error: 'Authentication failed'});
	},
	unauthorizedError(error, res) {
		console.error('Unauthorized Error:', error.message);
		// Respondes con un código 403 Forbidden para errores de acceso no autorizado
		res.status(403).json({error: 'Unauthorized access'});
	},
	default(error, res) {
		console.error('Unknown Error:', error.message);
		// Respondes con un código 500 Internal Server Error para otros tipos de errores
		res.status(500).json({error: 'Internal Server Error'});
	},
};

export default errorHandler;
