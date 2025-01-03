import { get, writable, derived, type Writable } from 'svelte/store';
import type { Todo } from '$lib/todoSchema';

export const PRIORITY_LEVELS = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITY_LEVELS)[number];

export const STATUS_FILTERS = ['all', 'completed', 'incomplete'] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const todos = writable<Todo[]>([]);
export const filteredTodos = writable<Todo[]>([]);

export const completedTodos = derived(todos, ($todos) =>
	$todos.filter((todo: Todo) => todo.completed)
);

export const toggleCompletion = async (id: number, todosStore: Writable<Todo[]>) => {
	const currentTodos = get(todosStore);
	const todoToUpdate = currentTodos.find((todo) => todo.id === id);

	if (todoToUpdate) {
		todosStore.update((todos) =>
			todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
		);

		try {
			const response = await fetch('/api/todos', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, completed: !todoToUpdate.completed })
			});

			if (!response.ok) {
				console.error('Erreur lors de la mise à jour du serveur:', await response.json());
				todosStore.update((todos) =>
					todos.map((todo) =>
						todo.id === id ? { ...todo, completed: todoToUpdate.completed } : todo
					)
				);
			}
		} catch (error) {
			console.error('Erreur réseau lors de la mise à jour:', error);
			todosStore.update((todos) =>
				todos.map((todo) =>
					todo.id === id ? { ...todo, completed: todoToUpdate.completed } : todo
				)
			);
		}
	}
};

export const deleteTodo = async (id: number, todosStore: Writable<Todo[]>) => {
	try {
		const response = await fetch(`/api/todos?id=${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			todosStore.update((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
		} else {
			console.error('Erreur lors de la suppression de la tâche:', await response.json());
		}
	} catch (error) {
		console.error('Erreur réseau lors de la suppression de la tâche:', error);
	}
};

export const filterTodos = (
	todos: Todo[],
	priority: string,
	status: string,
	dueDate: string
): Todo[] => {
	return todos.filter((todo: Todo) => {
		if (priority !== 'all' && todo.priority !== priority) return false;
		if (status === 'completed' && !todo.completed) return false;
		if (status === 'incomplete' && todo.completed) return false;
		if (dueDate && todo.dueDate) {
			const formattedDueDate = new Date(todo.dueDate).toISOString().split('T')[0];
			if (formattedDueDate !== dueDate) return false;
		}
		return true;
	});
};
