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

export const DELETE: RequestHandler = async ({ url }) => {
	try {
		const id = Number(url.searchParams.get('id'));

		// Validation de l'ID
		if (isNaN(id)) {
			console.error('ID invalide:', id);
			return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 });
		}

		console.log('ID de la tâche à supprimer:', id);

		await todoService.remove(id);

		console.log('Tâche supprimée avec succès:', id);
		return new Response(null, { status: 204 }); // Pas de contenu
	} catch (error) {
		console.error('Erreur lors de la suppression de la tâche:', error);
		return new Response(JSON.stringify({ error: 'Erreur lors de la suppression' }), {
			status: 500
		});
	}
};
