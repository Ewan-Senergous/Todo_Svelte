<script lang="ts">
	import { goto } from '$app/navigation';

	// Fonction pour obtenir la date du jour
	const getTodayDate = (): string => {
		const today = new Date();
		return today.toISOString().split('T')[0];
	};

	// Initialisation d'une nouvelle tâche
	let newTodo = {
		title: '',
		description: '',
		priority: 'medium',
		dueDate: getTodayDate(),
		completed: false // Par défaut, la tâche est "En cours"
	};

	// Fonction pour créer une nouvelle tâche
	const createTodo = async () => {
		try {
			console.log('Données envoyées:', newTodo);

			const response = await fetch('/api/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTodo)
			});

			const data = await response.json();
			console.log('Réponse du serveur:', data);

			if (response.ok) {
				goto('/'); // Redirection vers la page principale
			} else {
				alert('Erreur lors de la création de la tâche');
			}
		} catch (error) {
			console.error('Erreur lors de la création de la tâche:', error);
		}
	};
</script>

<main class="container mx-auto p-6">
	<h1 class="mb-4 text-2xl font-bold">Créer une nouvelle tâche</h1>

	<section class="rounded bg-white p-4 shadow">
		<form class="space-y-4" on:submit|preventDefault={createTodo}>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="title" class="block text-sm font-medium">Titre</label>
					<input
						type="text"
						id="title"
						bind:value={newTodo.title}
						required
						class="w-full rounded border p-2"
					/>
				</div>
				<div>
					<label for="priority" class="block text-sm font-medium">Priorité</label>
					<select id="priority" bind:value={newTodo.priority} class="w-full rounded border p-2">
						<option value="low">Faible</option>
						<option value="medium">Moyenne</option>
						<option value="high">Élevée</option>
					</select>
				</div>
			</div>
			<div>
				<label for="description" class="block text-sm font-medium">Description</label>
				<textarea
					id="description"
					bind:value={newTodo.description}
					class="w-full rounded border p-2"
				></textarea>
			</div>
			<div>
				<label for="dueDate" class="block text-sm font-medium">Date limite</label>
				<input
					type="date"
					id="dueDate"
					bind:value={newTodo.dueDate}
					class="w-full rounded border p-2"
				/>
			</div>

			<!-- Champ pour choisir l'état de la tâche -->
			<div>
				<label for="completed" class="block text-sm font-medium">Statut</label>
				<select id="completed" bind:value={newTodo.completed} class="w-full rounded border p-2">
					<option value={false}>En cours</option>
					<option value={true}>Terminé</option>
				</select>
			</div>

			<button type="submit" class="rounded bg-blue-500 p-2 text-white">Créer</button>
		</form>
	</section>
</main>

<style>
	main {
		max-width: 800px;
	}
</style>
