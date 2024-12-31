import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '@sveltejs/kit';
import { UpdateTodoSchema } from '$lib/todoSchema';
import { todoService } from '$lib/todos.server';

export const load = (async ({ params }) => {
	const todoId = parseInt(params.id, 10);
	if (isNaN(todoId)) {
		throw new Error('ID invalide');
	} // Récupérer l'ID du todo

	const form = await superValidate(zod(UpdateTodoSchema));
	const todo = await todoService.getById(todoId); // Récupérer les données du todo

	return { form, todo };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(UpdateTodoSchema));
		if (!form.valid) {
			return fail(400, { form });
		} // Validation des données

		const { id, ...data } = form.data;
		await todoService.update(id, data);

		return { form };
	}
};
