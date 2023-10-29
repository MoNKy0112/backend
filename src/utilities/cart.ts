export function canAddToCart(productStock: number, prevQuantity: number, quantityToAdd: number): boolean {
	// El usuario ya tiene este producto en el carrito
	const totalQuantity = prevQuantity + quantityToAdd;
	if (totalQuantity <= productStock) {
		// Hay suficiente stock para agregar uno más
		return true;
	}

	// No hay suficiente stock para agregar más
	return false;
}
