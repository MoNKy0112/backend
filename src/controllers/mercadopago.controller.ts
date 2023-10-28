
/* eslint-disable @typescript-eslint/naming-convention */

import {type Request, type Response} from 'express';
import MercadoPagoConfig, {Preference} from 'mercadopago';
// Const client = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102715-68f114798c57ff6fa5a0c75d88244183-1525915431'});
const client = new MercadoPagoConfig({accessToken: 'TEST-4999751880735799-102722-f86edf9771511613a2956599d623f117-1527430192'});

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
					unit_price: 1000,
				},
			],
			back_urls: {
				success: 'http://localhost:3000/feedback',
				failure: 'http://localhost:3000/feedback',
				pending: 'http://localhost:3000/feedback',
			},
			auto_return: 'approved',
			marketplace_fee: 5,
		}};

		const pref = await preference.create(preferenceData);
		console.log(pref.marketplace_fee);
		res.status(200).json(pref.id);
	} catch (error) {
		console.log('error #', error);
		res.status(500).json(error);
	}
};

