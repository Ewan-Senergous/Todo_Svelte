import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { DeleteTodoSchema } from '$lib/todoSchema';
import { todoService } from '$lib/todos.server';

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
	}
};
