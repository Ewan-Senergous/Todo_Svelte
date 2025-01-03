<script context="module" lang="ts">
	export interface Todo {
		id: number;
		title: string;
		description?: string;
		completed: boolean;
		priority: string; // 'low', 'medium', 'high'
		dueDate?: string;
	}
</script>

<script lang="ts">
	import { writable, derived, type Writable } from 'svelte/store';

	export let todos: Writable<Todo[]>; // Liste des tâches (Writable)
	export let filteredTodos: Writable<Todo[]>; // Liste des tâches filtrées (Writable)

	let filterPriority = writable<string>('all'); // Priorité : 'all', 'low', 'medium', 'high'
	let filterStatus = writable<string>('all'); // Statut : 'all', 'completed', 'incomplete'
	let filterDueDate = writable<string>(''); // Date d'échéance au format YYYY-MM-DD

	// Derived store pour calculer les tâches filtrées
	const derivedFilteredTodos = derived(
		[todos, filterPriority, filterStatus, filterDueDate],
		([$todos, $filterPriority, $filterStatus, $filterDueDate]) => {
			return $todos.filter((todo: Todo) => {
				if ($filterPriority !== 'all' && todo.priority !== $filterPriority) return false;
				if ($filterStatus === 'completed' && !todo.completed) return false;
				if ($filterStatus === 'incomplete' && todo.completed) return false;
				if ($filterDueDate && todo.dueDate) {
					const dueDate = new Date(todo.dueDate).toISOString().split('T')[0];
					if (dueDate !== $filterDueDate) return false;
				}
				return true;
			});
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
