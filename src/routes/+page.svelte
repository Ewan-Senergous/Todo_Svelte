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

	// Charger les tâches depuis l'API
	onMount(async () => {
		const response = await fetch('/api/todos');
		if (response.ok) {
			const data = await response.json();
			todos.set(data);
		}
	});

	// Basculer l'état d'une tâche
	const toggleCompletion = async (id: number) => {
		await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' });
		todos.update((current) =>
			current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
		);
	};

	// Supprimer une tâche
	const deleteTodo = async (id: number) => {
		await fetch(`/api/todos/${id}`, { method: 'DELETE' });
		todos.update((current) => current.filter((todo) => todo.id !== id));
	};
</script>

<main class="container mx-auto p-6">
	<h1 class="mb-4 text-2xl font-bold">📋 Gestion des tâches</h1>

	<!-- Lien vers la page de création -->
	<a href="/create" class="mb-6 inline-block rounded bg-blue-500 p-2 text-white">Créer une tâche</a>

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
