<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	// Interface pour les tâches
	interface Todo {
		id: number;
		title: string;
		description?: string;
		completed: boolean;
		priority: string;
		dueDate?: string;
	}

	// Store pour les tâches
	let todos = writable<Todo[]>([]);
	let editingTodo: Todo | null = null;

	// Fonction pour basculer l'état terminé/incomplet
	const toggleCompletion = async (id: number) => {
		try {
			const updatedTodos = $todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			);
			todos.set(updatedTodos);

			// Envoyez la modification au serveur
			await fetch('/api/todos', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, completed: !updatedTodos.find((t) => t.id === id)?.completed })
			});
		} catch (error) {
			console.error('Erreur lors de la mise à jour du statut:', error);
		}
	};

	// Fonction pour supprimer une tâche
	const deleteTodo = async (id: number) => {
		try {
			// Supprimez la tâche du serveur
			const response = await fetch(`/api/todos/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// Mettez à jour la liste localement
				todos.update((current) => current.filter((todo) => todo.id !== id));
				console.log(`Tâche avec l'ID ${id} supprimée avec succès.`);
			} else {
				console.error(`Erreur lors de la suppression de la tâche avec l'ID ${id}.`);
			}
		} catch (error) {
			console.error('Erreur réseau lors de la suppression:', error);
		}
	};

	// Fonction pour activer le mode édition
	const editTodo = (todo: Todo) => {
		editingTodo = { ...todo };
	};

	// Fonction pour modifier une tâche
	const updateTodo = async () => {
		if (!editingTodo) return;

		try {
			console.log('Modification envoyée:', editingTodo);

			// Envoyez les modifications au serveur
			const response = await fetch('/api/todos', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editingTodo)
			});

			const updatedTodo = await response.json();

			if (response.ok) {
				// Mettez à jour la tâche localement
				todos.update((current) =>
					current.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
				);
				console.log('Tâche mise à jour avec succès:', updatedTodo);
			} else {
				console.error('Erreur lors de la mise à jour de la tâche:', updatedTodo);
			}

			editingTodo = null; // Quitter le mode édition
		} catch (error) {
			console.error('Erreur réseau lors de la mise à jour:', error);
		}
	};

	// Fonction pour naviguer vers la page de création
	const navigateToCreate = () => {
		goto('/create'); // Redirige vers la page /create
	};

	// Charger les données initiales
	onMount(() => {
		fetch('/api/todos')
			.then((response) => response.json())
			.then((data) => {
				todos.set(data);
			});
	});
</script>

<main class="container mx-auto p-6">
	<h1 class="mb-4 text-2xl font-bold">📋 Gestion des tâches</h1>

	<!-- Bouton pour créer une tâche -->
	<div class="mb-6 flex justify-end">
		<button
			class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
			on:click={navigateToCreate}
		>
			➕ Créer une tâche
		</button>
	</div>

	<!-- Liste des tâches -->
	<section class="rounded bg-white p-4 shadow">
		<h2 class="mb-4 text-lg font-semibold">Tâches</h2>
		<ul class="space-y-4">
			{#each $todos as todo}
				<li class="flex flex-col space-y-2 rounded bg-gray-100 p-4 shadow">
					<div class="flex items-start justify-between">
						<div>
							<h3 class="text-lg font-semibold">{todo.title}</h3>

							<!-- Ajout de la description -->
							{#if todo.description}
								<p class="text-sm text-gray-600">{todo.description}</p>
							{/if}

							<p class="flex items-center space-x-2 text-sm">
								<strong>Priorité :</strong>
								<span
									class="inline-block rounded-full px-2 py-1 text-sm font-bold capitalize text-white"
									class:bg-green-500={todo.priority === 'low'}
									class:bg-orange-500={todo.priority === 'medium'}
									class:bg-red-500={todo.priority === 'high'}
								>
									{todo.priority}
								</span>
								<strong>Échéance :</strong>&nbsp;
								{todo.dueDate ? todo.dueDate.split('T')[0] : 'Non définie'}
							</p>
						</div>
						<div>
							<button
								class="mr-2 rounded px-4 py-1 font-semibold text-white"
								style="background-color: {todo.completed ? '#22c55e' : '#3b82f6'};"
								on:click={() => toggleCompletion(todo.id)}
							>
								{todo.completed ? '✔️ Terminé' : '⏳ En cours'}
							</button>
							<button class="mr-2 text-yellow-500" on:click={() => editTodo(todo)}>✏️</button>
							<button class="text-red-500" on:click={() => deleteTodo(todo.id)}>❌</button>
						</div>
					</div>
					{#if editingTodo?.id === todo.id}
						<form class="space-y-4" on:submit|preventDefault={updateTodo}>
							<!-- Formulaire d'édition -->
							<div>
								<label for="edit-title" class="block text-sm font-medium">Titre</label>
								<input
									type="text"
									id="edit-title"
									bind:value={editingTodo.title}
									required
									class="w-full rounded border p-2"
								/>
							</div>
							<div>
								<label for="edit-priority" class="block text-sm font-medium">Priorité</label>
								<select
									id="edit-priority"
									bind:value={editingTodo.priority}
									class="w-full rounded border p-2"
								>
									<option value="low">Faible</option>
									<option value="medium">Moyenne</option>
									<option value="high">Élevée</option>
								</select>
							</div>
							<div>
								<label for="edit-description" class="block text-sm font-medium">Description</label>
								<textarea
									id="edit-description"
									bind:value={editingTodo.description}
									class="w-full rounded border p-2"
								></textarea>
							</div>
							<div>
								<label for="edit-dueDate" class="block text-sm font-medium">Date limite</label>
								<input
									type="date"
									id="edit-dueDate"
									bind:value={editingTodo.dueDate}
									class="w-full rounded border p-2"
								/>
							</div>
							<button type="submit" class="rounded bg-blue-500 p-2 text-white">Enregistrer</button>
						</form>
					{/if}
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		max-width: 800px;
	}

	.bg-green-500 {
		background-color: #22c55e; /* Vert pour faible */
	}

	.bg-orange-500 {
		background-color: #f97316; /* Orange pour moyen */
	}

	.bg-red-500 {
		background-color: #ef4444; /* Rouge pour élevé */
	}
</style>
