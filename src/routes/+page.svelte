<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Définition du type pour une tâche (Todo)
	type Todo = {
		id: number;
		title: string;
		description?: string;
		completed: boolean;
		priority: 'low' | 'medium' | 'high';
		dueDate?: string; // La date est reçue en tant que chaîne
	};

	let todos: Todo[] = []; // Ajout du type explicite

	// Chargement des tâches depuis le serveur
	async function fetchTodos() {
		const response = await fetch('/api/todos');
		if (response.ok) {
			todos = await response.json();
		} else {
			console.error('Erreur lors de la récupération des tâches.');
		}
	}

	// Suppression d'une tâche
	async function deleteTodo(id: number) {
		const response = await fetch(`/api/todos/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			todos = todos.filter((todo) => todo.id !== id);
		} else {
			console.error('Erreur lors de la suppression de la tâche.');
		}
	}

	// Marquer une tâche comme terminée
	async function toggleComplete(id: number, completed: boolean) {
		const response = await fetch(`/api/todos/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ completed: !completed })
		});

		if (response.ok) {
			todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo));
		} else {
			console.error("Erreur lors de l'actualisation de l'état de la tâche.");
		}
	}

	onMount(() => {
		fetchTodos();
	});
</script>

<div class="container mx-auto mt-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Liste des Tâches</h1>
		<button
			class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
			on:click={() => goto('/create')}
		>
			+ Ajouter une Tâche
		</button>
	</div>

	{#if todos.length > 0}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each todos as todo}
				<div class="rounded bg-white p-4 shadow-md">
					<h2 class="mb-2 text-xl font-bold">{todo.title}</h2>
					<p class="mb-4 text-gray-600">{todo.description}</p>

					<div class="flex items-center justify-between">
						<div>
							<span
								class="inline-block rounded-full px-3 py-1 text-sm
                  {todo.priority === 'high' ? 'bg-red-500 text-white' : ''}
                  {todo.priority === 'medium' ? 'bg-yellow-500 text-white' : ''}
                  {todo.priority === 'low' ? 'bg-green-500 text-white' : ''}"
							>
								Priorité: {todo.priority}
							</span>
						</div>

						<button
							class="text-blue-500 hover:text-blue-700"
							on:click={() => toggleComplete(todo.id, todo.completed)}
						>
							{todo.completed ? 'Reprendre' : 'Compléter'}
						</button>
					</div>

					<div class="mt-4 flex justify-between">
						<button
							class="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-700"
							on:click={() => goto(`/id/${todo.id}`)}
						>
							Modifier
						</button>
						<button
							class="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-700"
							on:click={() => deleteTodo(todo.id)}
						>
							Supprimer
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-center text-gray-600">
			Aucune tâche disponible. Ajoutez une nouvelle tâche pour commencer.
		</p>
	{/if}
</div>
