<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Todo {
		id: number;
		title: string;
		description?: string;
		completed: boolean;
		priority: string;
		dueDate?: string;
	}

	let todos = writable<Todo[]>([]);

	// Charger des données d'exemple au démarrage
	onMount(() => {
		const initialTodos: Todo[] = [
			{ id: 1, title: 'Première tâche', completed: false, priority: 'medium' },
			{ id: 2, title: 'Deuxième tâche', completed: true, priority: 'high' }
		];
		todos.set(initialTodos);
	});

	// Gestion de l'ajout, de la suppression et de la modification des tâches
	let newTodo = { title: '', description: '', priority: 'medium', dueDate: '' };
	const addTodo = () => {
		todos.update((current) => {
			const id = current.length ? Math.max(...current.map((t) => t.id)) + 1 : 1;
			const todo: Todo = {
				id,
				title: newTodo.title,
				description: newTodo.description,
				priority: newTodo.priority,
				dueDate: newTodo.dueDate,
				completed: false
			};
			return [...current, todo];
		});
		newTodo = { title: '', description: '', priority: 'medium', dueDate: '' };
	};

	const toggleCompletion = (id: number) => {
		todos.update((current) =>
			current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
		);
	};

	const deleteTodo = (id: number) => {
		todos.update((current) => current.filter((todo) => todo.id !== id));
	};
</script>

<main class="container mx-auto p-6">
	<h1 class="mb-4 text-2xl font-bold">📋 Gestion des tâches</h1>

	<!-- Section pour ajouter une nouvelle tâche -->
	<section class="mb-6 rounded bg-white p-4 shadow">
		<h2 class="mb-4 text-lg font-semibold">Ajouter une tâche</h2>
		<form class="space-y-4" on:submit|preventDefault={addTodo}>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="title" class="block text-sm font-medium">Titre</label>
					<input
						type="text"
						id="title"
						bind:value={newTodo.title}
						required
						class="w-full rounded border p-2"
					/>
				</div>
				<div>
					<label for="priority" class="block text-sm font-medium">Priorité</label>
					<select id="priority" bind:value={newTodo.priority} class="w-full rounded border p-2">
						<option value="low">Faible</option>
						<option value="medium">Moyenne</option>
						<option value="high">Élevée</option>
					</select>
				</div>
			</div>
			<div>
				<label for="description" class="block text-sm font-medium">Description</label>
				<textarea
					id="description"
					bind:value={newTodo.description}
					class="w-full rounded border p-2"
				></textarea>
			</div>
			<div>
				<label for="dueDate" class="block text-sm font-medium">Date limite</label>
				<input
					type="date"
					id="dueDate"
					bind:value={newTodo.dueDate}
					class="w-full rounded border p-2"
				/>
			</div>
			<button type="submit" class="rounded bg-blue-500 p-2 text-white">Ajouter</button>
		</form>
	</section>

	<!-- Liste des tâches -->
	<section class="rounded bg-white p-4 shadow">
		<h2 class="mb-4 text-lg font-semibold">Tâches</h2>
		<ul class="space-y-4">
			{#each $todos as todo}
				<li class="flex items-start justify-between rounded bg-gray-100 p-4 shadow">
					<div>
						<h3 class="text-lg font-semibold">{todo.title}</h3>
						{#if todo.description}
							<p class="text-sm text-gray-600">{todo.description}</p>
						{/if}
						<p class="text-sm">
							<strong>Priorité :</strong>
							{todo.priority} |
							<strong>Échéance :</strong>
							{todo.dueDate || 'Non définie'}
						</p>
					</div>
					<div>
						<button class="mr-2 text-green-500" on:click={() => toggleCompletion(todo.id)}>
							{todo.completed ? '↩️' : '✔️'}
						</button>
						<button class="text-red-500" on:click={() => deleteTodo(todo.id)}> ❌ </button>
					</div>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		max-width: 800px;
	}
</style>
