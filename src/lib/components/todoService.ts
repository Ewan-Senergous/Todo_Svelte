import { get, writable, derived, type Writable } from 'svelte/store';
import type { Todo } from '$lib/todoSchema';

export const PRIORITY_LEVELS = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITY_LEVELS)[number];

export const STATUS_FILTERS = ['all', 'completed', 'incomplete'] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const todos = writable<Todo[]>([]);
export const filteredTodos = writable<Todo[]>([]);

export const completedTodos = derived(todos, ($todos) => $todos.filter((todo) => todo.completed));

export const toggleCompletion = async (id: number, todos: Writable<Todo[]>) => {
	const currentTodos = get(todos); // Obtenir la valeur réelle
	const todoToUpdate = currentTodos.find((todo) => todo.id === id);

	if (todoToUpdate) {
		todos.update((current) =>
			current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
		);

		try {
			const response = await fetch('/api/todos', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, completed: !todoToUpdate.completed })
			});

			if (!response.ok) {
				console.error('Erreur lors de la mise à jour du serveur:', await response.json());
				todos.update((current) =>
					current.map((todo) =>
						todo.id === id ? { ...todo, completed: todoToUpdate.completed } : todo
					)
				);
			}
		} catch (error) {
			console.error('Erreur réseau lors de la mise à jour:', error);
			todos.update((current) =>
				current.map((todo) =>
					todo.id === id ? { ...todo, completed: todoToUpdate.completed } : todo
				)
			);
		}
	}
};

export const updateTodo = async (editingTodo: Todo | null, todosStore: Writable<Todo[]>) => {
	if (!editingTodo) return;

	const formattedTodo = {
		...editingTodo,
		dueDate: editingTodo.dueDate ? new Date(editingTodo.dueDate).toISOString() : null
	};

	try {
		const response = await fetch('/api/todos', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formattedTodo)
		});

		if (response.ok) {
			const updatedTodo = await response.json();
			todosStore.update((current) =>
				current.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
			);
		} else {
			console.error('Erreur lors de la mise à jour :', await response.json());
		}
	} catch (error) {
		console.error('Erreur réseau lors de la mise à jour :', error);
	}
};

export const deleteTodo = async (id: number, todos: Writable<Todo[]>) => {
	try {
		const response = await fetch(`/api/todos?id=${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			todos.update((current) => current.filter((todo) => todo.id !== id));
		} else {
			console.error('Erreur lors de la suppression de la tâche:', await response.json());
		}
	} catch (error) {
		console.error('Erreur réseau lors de la suppression de la tâche:', error);
	}
};
