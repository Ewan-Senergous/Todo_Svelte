<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import Filter from '$lib/components/Filter.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import { todos, toggleCompletion, deleteTodo, updateTodo } from '$lib/components/todoService';
	import { goto } from '$app/navigation';
	import type { Todo } from '$lib/todoSchema';
	import { Button } from 'flowbite-svelte';

	let filteredTodos = writable<Todo[]>([]);
	let searchTerm = '';

	const navigateToEdit = (id: number) => {
		goto(`/${id}`);
	};

	const navigateToCreate = () => goto('/create');

	const searchTodos = async () => {
		try {
			const response = await fetch(`/api/todos?title=${encodeURIComponent(searchTerm)}`);
			const data = await response.json();
			if (response.ok) todos.set(data);
			else console.error('Erreur lors de la recherche :', data.error);
		} catch (error) {
			console.error('Erreur réseau lors de la recherche :', error);
		}
	};

	onMount(() => {
		fetch('/api/todos')
			.then((response) => response.json())
			.then((data: Todo[]) => todos.set(data));
	});
</script>

<main class="container mx-auto p-4 sm:p-6" in:fade={{ duration: 500 }}>
	<h1 class="mb-4 text-lg font-bold sm:text-2xl">📋 Gestion des tâches</h1>

	<div
		class="mb-6 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0"
	>
		<input
			type="text"
			placeholder="Rechercher une tâche..."
			bind:value={searchTerm}
			on:input={searchTodos}
			class="w-full rounded border p-2 text-sm sm:w-1/2"
		/>
		<Button
			color="green"
			class="flex w-full items-center justify-center space-x-2 text-sm font-bold text-white sm:w-auto sm:text-base"
			on:click={navigateToCreate}
		>
			<span class="text-xl font-extrabold text-yellow-300">+</span>
			<span>Créer une tâche</span>
		</Button>
	</div>

	<Filter {todos} bind:filteredTodos />

	<section>
		<TodoList
			filteredTodos={$filteredTodos}
			onNavigateToEdit={navigateToEdit}
			onDelete={(id) => deleteTodo(id, todos)}
			onToggle={(id) => toggleCompletion(id, todos)}
		/>
	</section>
</main>

<style>
	.container {
		max-width: 800px;
	}
</style>
