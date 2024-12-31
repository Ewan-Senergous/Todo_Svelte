<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Input,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Button,
		Alert
	} from 'flowbite-svelte';

	// Définition des types
	interface Task {
		id: number;
		text: string;
	}

	type AlertType = 'blue' | 'green' | 'yellow' | 'red';

	// Variables typées
	let tasks: Task[] = [];
	let newTask: string = '';
	let editMode: boolean = false;
	let taskToEdit: Task | null = null;
	let taskEditValue: string = '';
	let alertMessage: string = '';
	let alertType: AlertType = 'blue';

	// Ajouter une tâche
	function addTask() {
		if (newTask.trim()) {
			tasks = [...tasks, { id: Date.now(), text: newTask }];
			newTask = '';
			showAlert('Tâche ajoutée avec succès !', 'green'); // Utilisation de 'green' pour success
		} else {
			showAlert('Veuillez entrer une tâche valide.', 'red'); // Utilisation de 'red' pour error
		}
	}

	// Supprimer une tâche
	function deleteTask(id: number) {
		tasks = tasks.filter((task) => task.id !== id);
		showAlert('Tâche supprimée avec succès !', 'yellow'); // Utilisation de 'yellow' pour warning
	}

	// Modifier une tâche
	function editTask(task: Task) {
		editMode = true;
		taskToEdit = task;
		taskEditValue = task.text;
	}

	function saveTaskEdit() {
		if (taskEditValue.trim()) {
			tasks = tasks.map((task) =>
				task.id === (taskToEdit ? taskToEdit.id : -1) ? { ...task, text: taskEditValue } : task
			);
			editMode = false;
			taskToEdit = null;
			taskEditValue = '';
			showAlert('Tâche modifiée avec succès !', 'green'); // Utilisation de 'green' pour success
		} else {
			showAlert('Le texte de la tâche ne peut pas être vide.', 'red'); // Utilisation de 'red' pour error
		}
	}

	function cancelEdit() {
		editMode = false;
		taskToEdit = null;
		taskEditValue = '';
	}

	// Afficher une alerte
	function showAlert(message: string, type: AlertType) {
		alertMessage = message;
		alertType = type;
		setTimeout(() => {
			alertMessage = '';
		}, 3000);
	}
</script>

<div>
	<!-- Alert -->
	{#if alertMessage}
		<Alert color={alertType}>
			{alertMessage}
		</Alert>
	{/if}

	<!-- Ajouter une tâche -->
	<div class="mb-4">
		<Input placeholder="Ajouter une nouvelle tâche" bind:value={newTask} />
		<Button class="mt-2" color="blue" on:click={addTask}>Ajouter</Button>
	</div>

	<!-- Modifier une tâche -->
	{#if editMode}
		<div class="mb-4">
			<Input placeholder="Modifier la tâche" bind:value={taskEditValue} />
			<div class="actions mt-2">
				<Button color="green" on:click={saveTaskEdit}>Sauvegarder</Button>
				<Button color="red" on:click={cancelEdit}>Annuler</Button>
			</div>
		</div>
	{/if}

	<!-- Liste des tâches -->
	<Table>
		<TableHead>
			<TableHeadCell>#</TableHeadCell>
			<TableHeadCell>Tâche</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each tasks as task, index}
				<TableBodyRow>
					<TableBodyCell>{index + 1}</TableBodyCell>
					<TableBodyCell>{task.text}</TableBodyCell>
					<TableBodyCell>
						<div class="actions">
							<Button color="blue" on:click={() => editTask(task)}>Modifier</Button>
							<Button color="red" on:click={() => deleteTask(task.id)}>Supprimer</Button>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<style>
	.actions {
		display: flex;
		gap: 8px;
	}
</style>
