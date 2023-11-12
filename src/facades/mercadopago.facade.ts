import MercadoPagoConfig, {MerchantOrder, Preference, Payment} from 'mercadopago';

const client: MercadoPagoConfig = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102722-f86edf9771511613a2956599d623f117-1527430192'});

class Mercadopago {
	public async getData(paymentId: string, preferenceId: string, merchantOrderId: string) {
		try {
			const preference = new Preference(client);
			const preferenceData = await preference.get({preferenceId});
			const merchanOrder = new MerchantOrder(client);
			const merchanOrderData = await merchanOrder.get({merchantOrderId});
			const payment = new Payment(client);
			const paymentData = await payment.get({id: paymentId});

			const data = {preferenceData, merchanOrderData, paymentData};
			if (!data) throw new Error('Error obtaining order data in Mercado Pago');
			return data;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			} else {
				console.error(error);
				throw new Error('Unknown error when trying to obtain the data');
			}
		}
	}
}

export default new Mercadopago();
