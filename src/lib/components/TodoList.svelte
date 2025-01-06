<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import type { Todo } from '$lib/todoSchema';
	import { Button } from 'flowbite-svelte';

	export let filteredTodos: Todo[] = [];

	export let onNavigateToEdit: (id: number) => void;
	export let onDelete: (id: number) => void;
	export let onToggle: (id: number) => void;

	let draggedIndex: number | null = null;
	let overIndex: number | null = null;

	const handleDragStart = (index: number) => {
		draggedIndex = index;
	};

	const handleDragOver = (event: DragEvent, index: number) => {
		event.preventDefault();
		overIndex = index;
	};

	const handleDrop = () => {
		if (draggedIndex !== null && overIndex !== null && draggedIndex !== overIndex) {
			const updatedTodos = [...filteredTodos];
			const [movedTodo] = updatedTodos.splice(draggedIndex, 1);
			updatedTodos.splice(overIndex, 0, movedTodo);
			filteredTodos = updatedTodos;

			saveTaskOrder();
		}

		draggedIndex = null;
		overIndex = null;
	};

	const saveTaskOrder = async () => {
		try {
			const response = await fetch('/api/todos', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ todos: filteredTodos })
			});
			if (!response.ok) {
				console.error("Erreur lors de la sauvegarde de l'ordre:", await response.json());
			}
		} catch (error) {
			console.error('Erreur réseau lors de la sauvegarde:', error);
		}
	};

	const getDragClass = (index: number) => {
		if (index === draggedIndex) return 'dragging';
		if (index === overIndex) return 'drag-over';
		return '';
	};

	const navigateToEdit = (id: number) => {
		goto(`/${id}`);
	};
</script>

<div class="rounded border border-[#6c7280] bg-white p-4">
	<ul class="space-y-4">
		{#each filteredTodos as todo, index (todo.id)}
			<li
				draggable="true"
				on:dragstart={() => handleDragStart(index)}
				on:dragover={(e) => handleDragOver(e, index)}
				on:drop={handleDrop}
				class="flex cursor-move flex-col space-y-2 rounded bg-gray-100 p-4 shadow {getDragClass(
					index
				)}"
				in:slide={{ duration: 300 }}
				out:fade={{ duration: 200 }}
			>
				<div class="flex items-start justify-between">
					<div>
						<h3 class="text-sm font-bold">Titre : {todo.title}</h3>
						{#if todo.description}
							<p class="text-sm"><strong>Description :</strong> {todo.description}</p>
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
					<div class="flex items-center space-x-2">
						<Button
							on:click={() => onToggle(todo.id)}
							color={todo.completed ? 'green' : 'blue'}
							class="font-bold text-white"
						>
							{#if todo.completed}
								<span>👍 Terminé</span>
							{:else}
								<span>⏳ En cours</span>
							{/if}
						</Button>
						<button on:click={() => onNavigateToEdit(todo.id)} class="font-bold text-yellow-500">
							✏️
						</button>
						<button on:click={() => onDelete(todo.id)} class="font-bold text-red-500"> ❌ </button>
						<form method="POST" action="?/duplicateTodo" class="inline">
							<input type="hidden" name="id" value={todo.id} />
							<button type="submit" class="font-bold text-blue-500">🔁</button>
						</form>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	li[draggable='true'] {
		cursor: grab;
	}

	li.dragging {
		opacity: 0.5;
		transform: scale(1.02);
	}

	li.drag-over {
		border: 2px dashed #a1a1aa;
		background-color: #e5e7eb;
	}
</style>
