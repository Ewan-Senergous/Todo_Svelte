<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';

	interface Todo {
		id: number;
		title: string;
		description?: string;
		completed: boolean;
		priority: string;
		dueDate?: string;
	}

	let todos = writable<Todo[]>([]);
	let editingTodo: Todo | null = null;

	const toggleCompletion = async (id: number) => {
		todos.update((current) =>
			current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
		);

		const todoToUpdate = $todos.find((todo) => todo.id === id);
		if (todoToUpdate) {
			try {
				await fetch('/api/todos', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id, completed: !todoToUpdate.completed })
				});
			} catch (error) {
				console.error('Erreur réseau lors de la mise à jour de l’état:', error);
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
		try {
			const response = await fetch('/api/todos', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editingTodo)
			});

			if (response.ok) {
				const updatedTodo = await response.json();
				todos.update((current) =>
					current.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
				);
				editingTodo = null;
			} else {
				console.error('Erreur lors de la mise à jour:', await response.json());
			}
		} catch (error) {
			console.error('Erreur réseau lors de la mise à jour:', error);
		}
	};

	const navigateToCreate = () => {
		goto('/create');
	};

	onMount(() => {
		fetch('/api/todos')
			.then((response) => response.json())
			.then((data) => {
				todos.set(data);
			});
	});
</script>

<main class="container mx-auto p-6" in:fade={{ duration: 500 }}>
	<h1 class="mb-4 text-2xl font-bold">📋 Gestion des tâches</h1>
	<div class="mb-6 flex justify-end">
		<button
			class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
			on:click={navigateToCreate}
		>
			➕ Créer une tâche
		</button>
	</div>

	<section class="rounded bg-white p-4 shadow">
		<h2 class="mb-4 text-lg font-semibold">Tâches</h2>
		<ul class="space-y-4">
			{#each $todos as todo (todo.id)}
				<li
					class="flex flex-col space-y-2 rounded bg-gray-100 p-4 shadow"
					in:slide={{ duration: 300 }}
					out:fade={{ duration: 200 }}
				>
					<div class="flex items-start justify-between">
						<div>
							<h3 class="text-lg font-semibold">{todo.title}</h3>
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
								{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('fr-FR') : 'Non définie'}
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
	.container {
		max-width: 800px;
	}
</style>
