import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { DeleteTodoSchema } from '$lib/todoSchema';
import { todoService } from '$lib/todos.server';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	const searchTerm = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const size = parseInt(url.searchParams.get('size') || '10');

	return {
		searchTerm,
		form: await superValidate(zod(DeleteTodoSchema)),
		filteredTodos: todoService.getFiltered(searchTerm, page, size)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createFromFakeholder: async () => {
		await todoService.createFromFakeHolder();
		return { message: 'Todos created from fakeholder' };
	},

	delete: async ({ request }) => {
		const form = await superValidate(request, zod(DeleteTodoSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await todoService.remove(form.data.id);

		return { form };
	},

	duplicateTodo: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) {
			return fail(400, { error: "L'ID de la tâche est invalide." });
		}

		const originalTodo = await todoService.getById(id);
		if (!originalTodo) {
			return fail(404, { error: 'Tâche introuvable.' });
		}

		const duplicatedTodo = {
			...originalTodo,
			id: undefined,
			title: originalTodo.title + ' (Copie)'
		};

		await todoService.add(duplicatedTodo);

		throw redirect(303, '/');
	}
};
