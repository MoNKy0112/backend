
/* eslint-disable @typescript-eslint/naming-convention */

import {type Request, type Response} from 'express';
import MercadoPagoConfig, {Preference} from 'mercadopago';
const client = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102715-68f114798c57ff6fa5a0c75d88244183-1525915431'});

export const create_preference = async (req: Request, res: Response) => {
	try {
		const preference = new Preference(client);
		const preferenceData = {body: {
			items: [
				{
					id:	'1',
					title: 'producto',
					quantity: 1,
					currency_id: 'COP',
					unit_price: 100,
				},
			],
			back_urls: {
				success: 'http://localhost:3000/feedback',
				failure: 'http://localhost:3000/feedback',
				pending: 'http://localhost:3000/feedback',
			},
			auto_return: 'approved',
		}};

		const pref = await preference.create(preferenceData);
		console.log(pref.id);
		res.status(200).json(pref.id);
	} catch (error) {
		console.log('error #', error);
		res.status(500).json(error);
	}
};

