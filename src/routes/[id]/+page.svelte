<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Todo } from '$lib/todoSchema';

	type EditableTodo = Omit<Todo, 'dueDate'> & { dueDate: string | null };

	let todo: EditableTodo | null = null;
	let id: number;

	function toInputDate(date: string | Date | null): string {
		if (!date) return '';
		return new Date(date).toISOString().split('T')[0];
	}

	onMount(async () => {
		id = +$page.params.id;
		try {
			const response = await fetch(`/api/todos/${id}`);
			if (!response.ok) {
				throw new Error('Erreur lors du chargement de la tâche.');
			}
			const fetchedTodo = await response.json();
			todo = {
				...fetchedTodo,
				dueDate: fetchedTodo.dueDate ? toInputDate(fetchedTodo.dueDate) : null
			};
		} catch (error) {
			console.error(error);
			goto('/');
		}
	});

	const saveTodo = async () => {
		if (!todo) return;

		try {
			const updatedTodo = {
				...todo,
				dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString() : null
			};

			console.log('Tâche à sauvegarder :', updatedTodo);

			const response = await fetch(`/api/todos/${updatedTodo.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedTodo)
			});
			if (!response.ok) {
				throw new Error('Erreur lors de la sauvegarde.');
			}
			goto('/');
		} catch (error) {
			console.error(error);
		}
	};

	const cancelEdit = () => goto('/');
</script>

{#if todo}
	<main class="container mx-auto p-6">
		<h1 class="mb-4 text-2xl font-bold">Modifier la tâche #{todo.id}</h1>

		<form class="space-y-4" on:submit|preventDefault={saveTodo}>
			<div>
				<label for="edit-title" class="block text-sm font-medium">Titre</label>
				<input
					type="text"
					id="edit-title"
					bind:value={todo.title}
					required
					class="w-full rounded border p-2"
				/>
			</div>
			<div>
				<label for="edit-priority" class="block text-sm font-medium">Priorité</label>
				<select id="edit-priority" bind:value={todo.priority} class="w-full rounded border p-2">
					<option value="low">Faible</option>
					<option value="medium">Moyenne</option>
					<option value="high">Élevée</option>
				</select>
			</div>
			<div>
				<label for="edit-description" class="block text-sm font-medium">Description</label>
				<textarea
					id="edit-description"
					bind:value={todo.description}
					class="w-full rounded border p-2"
				></textarea>
			</div>
			<div>
				<label for="edit-dueDate" class="block text-sm font-medium">Date limite</label>
				<input
					type="date"
					id="edit-dueDate"
					bind:value={todo.dueDate}
					class="w-full rounded border p-2"
				/>
			</div>
			<div class="flex space-x-4">
				<button type="submit" class="rounded bg-blue-500 p-2 font-bold text-white">
					Enregistrer
				</button>
				<button
					type="button"
					on:click={cancelEdit}
					class="rounded bg-gray-500 p-2 font-bold text-white"
				>
					Annuler
				</button>
			</div>
		</form>
	</main>
{:else}
	<p>Chargement...</p>
{/if}

<style>
	.container {
		max-width: 800px;
	}
</style>
