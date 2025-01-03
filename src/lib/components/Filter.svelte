<script lang="ts">
	import { writable, derived, type Writable } from 'svelte/store';
	import type { Todo } from '$lib/todoSchema';

	export let todos: Writable<Todo[]>;
	export let filteredTodos: Writable<Todo[]>;

	let filterPriority = writable<string>('all');
	let filterStatus = writable<string>('all');
	let filterDueDate = writable<string>('');

	const filterTodos = (
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

	// Mettre à jour FilteredTodos
	const derivedFilteredTodos = derived(
		[todos, filterPriority, filterStatus, filterDueDate],
		([$todos, $filterPriority, $filterStatus, $filterDueDate]) => {
			return filterTodos($todos, $filterPriority, $filterStatus, $filterDueDate);
		}
	);

	derivedFilteredTodos.subscribe((value) => {
		filteredTodos.set(value);
	});
</script>

<section class="mb-6 rounded bg-gray-100 p-4 shadow">
	<h2 class="mb-4 text-lg font-semibold">Filtres</h2>
	<div class="grid gap-4 md:grid-cols-3">
		<div>
			<label for="filter-priority" class="block text-sm font-medium">Priorité</label>
			<select id="filter-priority" bind:value={$filterPriority} class="w-full rounded border p-2">
				<option value="all">Toutes</option>
				<option value="low">Faible</option>
				<option value="medium">Moyenne</option>
				<option value="high">Élevée</option>
			</select>
		</div>

		<div>
			<label for="filter-status" class="block text-sm font-medium">Statut</label>
			<select id="filter-status" bind:value={$filterStatus} class="w-full rounded border p-2">
				<option value="all">Tous</option>
				<option value="completed">Terminés</option>
				<option value="incomplete">En cours</option>
			</select>
		</div>

		<div>
			<label for="filter-dueDate" class="block text-sm font-medium">Date d'échéance</label>
			<input
				id="filter-dueDate"
				type="date"
				bind:value={$filterDueDate}
				class="w-full rounded border p-2"
			/>
		</div>
	</div>
</section>
