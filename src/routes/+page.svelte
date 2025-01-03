<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import { Button } from 'flowbite-svelte';
	import Filter from '$lib/components/Filter.svelte'; // Import du composant de filtre

	// Interface pour représenter une tâche
	interface Todo {
		id: number;
		title: string;
		description?: string;
		completed: boolean;
		priority: string; // 'low', 'medium', 'high'
		dueDate?: string;
	}

	let todos = writable<Todo[]>([]); // Liste de toutes les tâches
	let filteredTodos = writable<Todo[]>([]); // Liste des tâches filtrées

	let editingTodo: Todo | null = null;

	const toggleCompletion = async (id: number) => {
		const todoToUpdate = $todos.find((todo) => todo.id === id);

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

	const deleteTodo = async (id: number) => {
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

	const editTodo = (todo: Todo) => {
		editingTodo = { ...todo };
	};

	const updateTodo = async () => {
		if (editingTodo) {
			try {
				const formattedTodo = {
					...editingTodo,
					dueDate: editingTodo.dueDate ? new Date(editingTodo.dueDate).toISOString() : null
				};

				const response = await fetch('/api/todos', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formattedTodo)
				});

				if (response.ok) {
					const updatedTodo = await response.json();
					todos.update((current) =>
						current.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
					);
					editingTodo = null; // Quitter le mode édition
				} else {
					console.error('Erreur lors de la mise à jour:', await response.json());
				}
			} catch (error) {
				console.error('Erreur réseau lors de la mise à jour:', error);
			}
		}
	};

	const navigateToCreate = () => {
		goto('/create');
	};

	let searchTerm = '';

	const searchTodos = async () => {
		try {
			const response = await fetch(`/api/todos?title=${encodeURIComponent(searchTerm)}`);
			const data = await response.json();

			if (response.ok) {
				todos.set(data);
			} else {
				console.error('Erreur lors de la recherche :', data.error);
			}
		} catch (error) {
			console.error('Erreur réseau lors de la recherche :', error);
		}
	};

	onMount(() => {
		fetch('/api/todos')
			.then((response) => response.json())
			.then((data: Todo[]) => {
				todos.set(data);
			});
	});
</script>

<main class="container mx-auto p-6" in:fade={{ duration: 500 }}>
	<h1 class="mb-4 text-2xl font-bold">📋 Gestion des tâches</h1>

	<!-- Barre de recherche et bouton "Créer une tâche" -->
	<div class="mb-6 flex items-center justify-between">
		<input
			type="text"
			placeholder="Rechercher une todo..."
			bind:value={searchTerm}
			on:input={searchTodos}
			class="w-1/2 rounded border p-2"
		/>
		<Button
			color="green"
			class="flex items-center space-x-2 font-bold text-white"
			on:click={navigateToCreate}
		>
			<span class="text-xl font-extrabold text-yellow-300">+</span>
			<span>Créer une tâche</span>
		</Button>
	</div>

	<!-- Section des filtres -->
	<Filter {todos} bind:filteredTodos />

	<!-- Liste des tâches -->
	<section class="rounded border border-[#6c7280] bg-white p-4">
		<h2 class="mb-4 text-lg font-semibold">Tâches</h2>
		<ul class="space-y-4">
			{#each $filteredTodos as todo (todo.id)}
				<li
					class="flex flex-col space-y-2 rounded bg-gray-100 p-4 shadow"
					in:slide={{ duration: 300 }}
					out:fade={{ duration: 200 }}
				>
					<div class="flex items-start justify-between">
						<div>
							<h3 class="text-sm font-bold">Titre : {todo.title}</h3>

							{#if todo.description}
								<p class="text-sm">
									<strong>Description : </strong>&nbsp;{todo.description}
								</p>
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
								{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('fr-FR') : 'Non définie'}
							</p>
						</div>
						<div class="flex space-x-2">
							<Button
								on:click={() => toggleCompletion(todo.id)}
								color={todo.completed ? 'green' : 'blue'}
								class={`font-bold text-white `}
							>
								{#if todo.completed}
									<span>👍 Terminé</span>
								{:else}
									<span>⏳ En cours</span>
								{/if}
							</Button>

							<button class="mr-2 text-yellow-500" on:click={() => editTodo(todo)}>✏️</button>
							<button class="text-red-500" on:click={() => deleteTodo(todo.id)}>❌</button>
						</div>
					</div>
					{#if editingTodo?.id === todo.id}
						<form class="space-y-4" on:submit|preventDefault={updateTodo}>
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
								<p class="mt-2 text-sm">
									Échéance actuelle : {editingTodo.dueDate
										? new Date(editingTodo.dueDate).toLocaleDateString('fr-FR')
										: 'Non définie'}
								</p>
							</div>
							<div class="flex space-x-4">
								<button type="submit" class="rounded bg-blue-500 p-2 font-bold text-white"
									>Enregistrer</button
								>
								<button
									type="button"
									class="rounded bg-gray-500 p-2 font-bold text-white"
									on:click={() => {
										editingTodo = null; // Annuler l'édition
									}}
								>
									Annuler
								</button>
							</div>
						</form>
					{/if}
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	.container {
		max-width: 800px;
	}
</style>
