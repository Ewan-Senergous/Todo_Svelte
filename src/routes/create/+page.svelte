<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import { goto } from '$app/navigation';

	// Interface pour une tâche
	interface Todo {
		title: string;
		description?: string;
		completed: boolean;
		priority: 'low' | 'medium' | 'high';
		dueDate: string;
	}

	// Fonction pour sauvegarder une tâche
	const saveTodo = async (todo: Todo) => {
		try {
			const response = await fetch('/api/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(todo)
			});

			if (response.ok) {
				goto('/'); // Retour à la page principale après création
			} else {
				console.error('Erreur lors de la création de la tâche');
			}
		} catch (error) {
			console.error('Erreur réseau ou serveur:', error);
		}
	};
</script>

<main class="container mx-auto p-6">
	<h1 class="mb-4 text-2xl font-bold">Créer une nouvelle tâche</h1>
	<Form onSave={saveTodo} />
</main>

<style>
	main {
		max-width: 800px;
	}
</style>
