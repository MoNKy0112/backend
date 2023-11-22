import Agenda, {type AgendaConfig} from 'agenda';
import Task from '../models/Task';
import orderFacade from '../facades/order.facade';
class TaskScheduler {
	private readonly agenda: Agenda;
	constructor() {
		this.agenda = new Agenda().mongo(mongoose.connection, 'Task');
	}

	public async expireOrderTask(orderId: string, scheduledAt: Date): Promise<void> {
		try {
			// Define la lógica de la tarea
			this.agenda.define(`expireOrderTask${orderId}`, async () => {
				try {
					console.log(`Ejecutando tarea programada: expireOrderTask${orderId}`);
					const order = await orderFacade.getOrderById(orderId);
					if (order.status === '_') {
						await orderFacade.returnStock(order);
					}
				} catch (error) {
					console.error('Error durante la ejecución de la tarea expireOrderTask:', error);
					throw error; // Lanza el error para que sea manejado por el código que llamó a la tarea
				}
			});

			// Crea una nueva tarea
			const nuevaTarea = new Task({
				orderId,
				date: scheduledAt,
			});
			if (!nuevaTarea) throw new Error('Error trying to create task');

			// Guarda la tarea en la base de datos
			await nuevaTarea.save();

			console.log(`Tarea programada expireOrderTask${orderId} guardada exitosamente`);
			// Programa la tarea para ejecutarse
			await this.agenda.schedule(scheduledAt, `expireOrderTask${orderId}`, {});

			console.log(`Tarea programada expireOrderTask${orderId} correctamente`);
		} catch (error) {
			console.error(`Error al crear la tarea programada expireOrderTask${orderId}:`, error);
			throw error;
		}
	}

	public async start(): Promise<void> {
		await this.agenda.start();
	}

	public async stop(): Promise<void> {
		await this.agenda.stop();
	}
}

export default new TaskScheduler();
