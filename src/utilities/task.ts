/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import Agenda, {type AgendaConfig} from 'agenda';
import orderFacade from '../facades/order.facade';
import config from '../config';

type Idata = {
	task: string;
	[key: string]: any;
};

class TaskScheduler {
	private readonly agenda: Agenda;

	constructor() {
		const dbURL = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.ztqce77.mongodb.net/?retryWrites=true&w=majority`;
		this.agenda = new Agenda({db: {address: dbURL, collection: 'task'}});
	}

	public async expireOrderTask(orderId: string, scheduledAt: Date): Promise<void> {
		try {
			// Define la lógica de la tarea
			this.agenda.define(`expireOrderTask${orderId}`, async () => {
				try {
					console.log(`Ejecutando tarea programada: expireOrderTask${orderId}`);
					const order = await orderFacade.getOrderById(orderId);
					if (order.status === '_') {
						console.log('order expired');
						await orderFacade.updateOrder(orderId, {status: 'expired'});
						await orderFacade.returnStock(order);
					}
				} catch (error) {
					console.error('Error durante la ejecución de la tarea expireOrderTask:', error);
					throw error; // Lanza el error para que sea manejado por el código que llamó a la tarea
				}
			});
		} catch (error) {
			console.error(`Error al crear la tarea programada expireOrderTask${orderId}:`, error);
			throw error;
		}
	}

	public async startWithServer(): Promise<void> {
		await this.agenda.start().then(async () => {
			console.log('Agenda iniciada correctamente.');

			// Ejecutar inmediatamente todas las tareas pendientes al iniciar el servidor
			const tasks = await this.agenda.jobs({lastFinishedAt: {$exists: false}});

			// También puedes agregar logs para verificar el estado de las tareas individuales
			tasks.forEach(async task => {
				// Console.log(task.enable());
				let date: Date = new Date();
				const previousDate: Date = task.attrs.nextRunAt!;
				if (task.attrs.data.task === 'expireOrder' && task.attrs.data.orderId) {
					if (previousDate.getTime() <= Date.now()) {
						date = new Date(Date.now());
					} else {
						date = task.attrs.nextRunAt!;
					}

					const {orderId} = task.attrs.data;
					await this.expireOrderTask(orderId as string, date);
				}
			});
			// Resto del código de inicio del servidor
		});
	}

	public async start(): Promise<void> {
		await this.agenda.start();
	}

	public async stop(): Promise<void> {
		await this.agenda.stop();
	}

	public async schedule(scheduledAt: Date, names: string, data: Idata) {
		await this.agenda.schedule(scheduledAt, names, data);

		console.log(`Tarea programada ${names} correctamente`);
	}
}

export default new TaskScheduler();

