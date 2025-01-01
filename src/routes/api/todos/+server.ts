import type { RequestHandler } from './$types';
import { db } from '$lib/todos.server';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		console.log('Données reçues pour création:', data);

		const newTodo = await db.todo.create({
			data: {
				title: data.title,
				description: data.description || null,
				completed: data.completed || false,
				priority: data.priority || 'medium',
				dueDate: data.dueDate ? new Date(data.dueDate) : null
			}
		});

		console.log('Nouvelle tâche créée:', newTodo);

		return new Response(JSON.stringify(newTodo), { status: 201 });
	} catch (error) {
		console.error('Erreur lors de la création de la tâche:', error);
		return new Response('Erreur serveur', { status: 500 });
	}
};
