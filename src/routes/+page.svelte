<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import Filter from '$lib/components/Filter.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import { todos, toggleCompletion, deleteTodo, updateTodo } from '$lib/components/todoService';
	import { goto } from '$app/navigation';
	import { type PageServerData } from './$types';

	import { Button, Heading, Input } from 'flowbite-svelte';

	type Props = {
		data: PageServerData
	}

	let { data }: Props = $props();

	const navigateToEdit = (id: number) => {
		goto(`/${id}`);
	};

	const navigateToCreate = () => goto('/create');

</script>

{#await data.filteredTodos then filteredTodos}
	<main class="max-w-3xl md:max-w-5xl mx-auto p-4 sm:p-6 space-y-6" in:fade={{ duration: 500 }}>
		<Heading tag="h1" class="text-4xl">📋 Gestion des tâches</Heading>

		<div
			class="mb-6 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0"
		>
			<Input
				type="text"
				placeholder="Rechercher une tâche..."
				bind:value={data.searchTerm}
				on:input={data.searchTerm}
				class="w-full text-sm sm:w-1/2"
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

		<!--<Filter {todos} filteredTodos={filteredTodos} />-->

		<section>
			<TodoList
				filteredTodos={filteredTodos.items}
				onNavigateToEdit={navigateToEdit}
				onDelete={(id) => deleteTodo(id, todos)}
				onToggle={(id) => toggleCompletion(id, todos)}
			/>
		</section>
	</main>
{/await}