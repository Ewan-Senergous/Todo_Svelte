import { todoService } from '$lib/todos.server';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const todos = await todoService.get();
	return new Response(JSON.stringify(todos), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		console.log('Données reçues dans POST:', data);

		if (data.dueDate) {
			data.dueDate = new Date(data.dueDate);
		}

		const todo = await todoService.add(data);
		console.log('Tâche créée avec succès:', todo);
		return new Response(JSON.stringify(todo), { status: 201 });
	} catch (error) {
		console.error('Erreur lors de la création de la tâche:', error);
		return new Response(JSON.stringify({ error: 'Erreur lors de la création de la tâche' }), {
			status: 500
		});
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		console.log('Données reçues dans PATCH:', data);

		// Vérifiez si l'ID est fourni
		if (!data.id) {
			return new Response(JSON.stringify({ error: 'ID requis' }), { status: 400 });
		}

		// Conversion de `dueDate` en format Date si présent
		if (data.dueDate) {
			data.dueDate = new Date(data.dueDate);
		}

		const updatedTodo = await todoService.update(data.id, data);
		console.log('Tâche mise à jour avec succès:', updatedTodo);
		return new Response(JSON.stringify(updatedTodo), { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de la tâche:', error);
		return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour' }), {
			status: 500
		});
	}
};
