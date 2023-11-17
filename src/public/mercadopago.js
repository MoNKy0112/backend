/* eslint-disable @typescript-eslint/no-unused-vars */
// Tienda

const tiunKey = 'TEST-a6587ee8-c0ea-4440-bdec-429bbc3da59d';
const jKey = 'TEST-b9d8b3e8-7cb2-49c2-b5f4-2fb3f8a9371e';
const sellerKey = 'TEST-c5249e26-548f-4bef-a100-351c30bfa9bf';

const mercadopago = new MercadoPago(tiunKey, {
	locale: 'es-CO',
});
// Const mercadopago = new MercadoPago('TEST-c5249e26-548f-4bef-a100-351c30bfa9bf', {
// 	locale: 'es-CO',
// });

document.getElementById('checkout-btn').addEventListener('click', () => {
	const orderData = {
		orderId: document.getElementById('order-id').value,
	};
	console.log('algo');
	fetch('http://localhost:3000/create_preference', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(orderData),
	})
		.then(async response => response.json())
		.then(preference => {
			createCheckoutButton(preference);
		})
		.catch(() => {
			alert('Unexpected error');
		});
});

function createCheckoutButton(preferenceId) {
	// Initialize the checkout
	const bricksBuilder = mercadopago.bricks();
	const renderComponent = async bricksBuilder => {
		if (window.checkoutButton) window.checkoutButton.unmount();
		await bricksBuilder.create(
			'wallet',
			'button-checkout', // Class/id where the payment button will be displayed
			{
				initialization: {
					marketplace: true,
					preferenceId,
				},
				callbacks: {
					onError(error) {
						console.error('error', error);
					},
					onReady() {},
				},
			},
		);
	};

	window.checkoutButton = renderComponent(bricksBuilder);
}

