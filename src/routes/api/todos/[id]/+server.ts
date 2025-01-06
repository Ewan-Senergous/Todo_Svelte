import { todoService } from '$lib/todos.server';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = Number(params.id);

		if (isNaN(id)) {
			return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 });
		}

		const todo = await todoService.getById(id);
		if (!todo) {
			return new Response(JSON.stringify({ error: 'Tâche introuvable' }), { status: 404 });
		}

		return new Response(JSON.stringify(todo), { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la récupération de la tâche:', error);
		return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
			status: 500
		});
	}
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const id = Number(params.id);
		if (isNaN(id)) {
			return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 });
		}

		const data = await request.json();
		const updatedTodo = await todoService.update(id, data);

		if (!updatedTodo) {
			return new Response(JSON.stringify({ error: 'Tâche introuvable' }), { status: 404 });
		}

		return new Response(JSON.stringify(updatedTodo), { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de la tâche :', error);
		return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
	}
};
