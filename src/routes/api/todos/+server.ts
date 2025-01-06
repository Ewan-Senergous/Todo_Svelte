import { todoService } from '$lib/todos.server';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const title = url.searchParams.get('title') || '';

		if (title) {
			const todos = await todoService.searchByTitle(title);
			return new Response(JSON.stringify(todos), { status: 200 });
		}

		const todos = await todoService.get();
		return new Response(JSON.stringify(todos), { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la récupération des tâches:', error);
		return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des tâches' }), {
			status: 500
		});
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		console.log('Données reçues dans POST:', data);

		if (data.dueDate) {
			data.dueDate = new Date(data.dueDate);
		}

		const todo = await todoService.add(data);
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

		if (Array.isArray(data.todos)) {
			for (const [index, todo] of data.todos.entries()) {
				await todoService.update(todo.id, { order: index });
			}
			console.log('Ordre des tâches mis à jour avec succès');
			return new Response(JSON.stringify({ message: 'Ordre mis à jour' }), { status: 200 });
		}

		const id = data.id;

		if (!id || isNaN(Number(id))) {
			return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 });
		}

		const updatedTodo = await todoService.update(id, data);

		if (!updatedTodo) {
			return new Response(JSON.stringify({ error: 'Tâche introuvable' }), { status: 404 });
		}

		return new Response(JSON.stringify(updatedTodo), { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de la tâche :', error);
		return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour' }), {
			status: 500
		});
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	try {
		const id = Number(url.searchParams.get('id'));

		if (isNaN(id)) {
			console.error('ID invalide:', id);
			return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 });
		}

		await todoService.remove(id);

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Erreur lors de la suppression de la tâche:', error);
		return new Response(JSON.stringify({ error: 'Erreur lors de la suppression' }), {
			status: 500
		});
	}
};
