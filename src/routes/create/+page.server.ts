import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '@sveltejs/kit';
import { CreateTodoSchema } from '$lib/todoSchema';
import { todoService } from '$lib/todos.server';

export const load = (async () => {
	const form = await superValidate(zod(CreateTodoSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(CreateTodoSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await todoService.add({
			title: form.data.title,
			description: form.data.description ?? null,
			completed: form.data.completed ?? false,
			priority: form.data.priority,
			dueDate: form.data.dueDate ?? null
		});

		return { form };
	}
};
