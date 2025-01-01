<script lang="ts">
	interface Todo {
		title: string;
		description?: string;
		completed: boolean;
		priority: 'low' | 'medium' | 'high';
		dueDate: string; // Format ISO pour la date
	}

	export let todo: Todo = {
		title: '',
		description: '',
		completed: false,
		priority: 'medium',
		dueDate: ''
	};

	export let onSave: (todo: Todo) => void;

	let isSaving = false;

	const handleSubmit = async () => {
		isSaving = true;
		await onSave(todo);
		isSaving = false;
	};
</script>

<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
	<div>
		<label for="title" class="block text-sm font-medium">Titre</label>
		<input
			type="text"
			id="title"
			bind:value={todo.title}
			required
			class="w-full rounded border p-2"
		/>
	</div>

	<div>
		<label for="priority" class="block text-sm font-medium">Priorité</label>
		<select id="priority" bind:value={todo.priority} class="w-full rounded border p-2">
			<option value="low">Faible</option>
			<option value="medium">Moyenne</option>
			<option value="high">Élevée</option>
		</select>
	</div>

	<div>
		<label for="description" class="block text-sm font-medium">Description</label>
		<textarea id="description" bind:value={todo.description} class="w-full rounded border p-2"
		></textarea>
	</div>

	<div>
		<label for="dueDate" class="block text-sm font-medium">Date limite</label>
		<input type="date" id="dueDate" bind:value={todo.dueDate} class="w-full rounded border p-2" />
	</div>

	<button type="submit" class="rounded bg-blue-500 p-2 text-white" disabled={isSaving}>
		{isSaving ? 'Enregistrement...' : 'Enregistrer'}
	</button>
</form>
