import { z } from 'zod';

const TodoSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Le titre est obligatoire' })
		.max(100, { message: 'Max 100 caractères' }),

	description: z.string().max(500, { message: 'Max 500 caractères' }).optional(),

	completed: z.boolean().optional().default(false),

	priority: z.enum(['low', 'medium', 'high']).default('medium'),

	dueDate: z.coerce.date().nullable()
});

export const CreateTodoSchema = TodoSchema;

export const UpdateTodoSchema = TodoSchema.extend({
	id: z.number({ required_error: "L'ID est requis pour la mise à jour" })
})
	.partial()
	.required({ id: true });

export const DeleteTodoSchema = z.object({
	id: z.number({
		required_error: "L'ID est requis pour la suppression",
		invalid_type_error: "L'ID doit être un nombre valide"
	})
});

export interface Todo {
	id: number;
	title: string;
	description?: string;
	completed: boolean;
	priority: string;
	dueDate?: string;
}
