export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthenticationError';
	}
}

export class AuthorizationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthorizationError';
	}
}

export class ConnectionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ConnectionError';
	}
}

export class GeneralError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'GeneralError';
	}
}

export class ValidationError extends Error {
	constructor(message: string, public field: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

export class UserNotFoundError extends Error {
	constructor(userId: string) {
		super(`user not found with ID: ${userId}`);
		this.name = 'userNotFoundError';
	}
}

export class ProductNotFoundError extends Error {
	constructor(productId: string) {
		super(`Product not found with ID: ${productId}`);
		this.name = 'ProductNotFoundError';
	}
}

export class InsufficientStockError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InsufficientStockError';
	}
}

export class EmptyCartError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'EmptyCartError';
	}
}

export class PaymentError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PaymentError';
	}
}

export class OrderCreationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'OrderCreationError';
	}
}

export class OrderNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'OrderNotFoundError';
	}
}

export class DuplicateUserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DuplicateUserError';
	}
}

