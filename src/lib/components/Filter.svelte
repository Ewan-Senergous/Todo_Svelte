<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Dispatcher pour transmettre les filtres au parent
	const dispatch = createEventDispatcher();

	// Variables des filtres
	let title = '';
	let priority = 'all'; // 'low', 'medium', 'high', 'all'
	let status = 'all'; // 'completed', 'incomplete', 'all'
	let dueDate = '';

	// Fonction pour envoyer les filtres au parent
	const updateFilters = () => {
		dispatch('filterChange', { title, priority, status, dueDate });
	};
</script>

<section class="mb-6 rounded bg-gray-100 p-4 shadow">
	<h2 class="mb-4 text-lg font-semibold">Filtres</h2>
	<div class="grid gap-4 md:grid-cols-4">
		<!-- Filtrer par titre -->
		<div>
			<label for="filter-title" class="block text-sm font-medium">Titre</label>
			<input
				id="filter-title"
				type="text"
				bind:value={title}
				placeholder="Recherche par titre"
				class="w-full rounded border p-2"
				on:input={updateFilters}
			/>
		</div>

		<!-- Filtrer par priorité -->
		<div>
			<label for="filter-priority" class="block text-sm font-medium">Priorité</label>
			<select
				id="filter-priority"
				bind:value={priority}
				class="w-full rounded border p-2"
				on:change={updateFilters}
			>
				<option value="all">Toutes</option>
				<option value="low">Faible</option>
				<option value="medium">Moyenne</option>
				<option value="high">Élevée</option>
			</select>
		</div>

		<!-- Filtrer par statut -->
		<div>
			<label for="filter-status" class="block text-sm font-medium">Statut</label>
			<select
				id="filter-status"
				bind:value={status}
				class="w-full rounded border p-2"
				on:change={updateFilters}
			>
				<option value="all">Tous</option>
				<option value="completed">Terminés</option>
				<option value="incomplete">En cours</option>
			</select>
		</div>

		<!-- Filtrer par date d'échéance -->
		<div>
			<label for="filter-dueDate" class="block text-sm font-medium">Date d'échéance</label>
			<input
				id="filter-dueDate"
				type="date"
				bind:value={dueDate}
				class="w-full rounded border p-2"
				on:change={updateFilters}
			/>
		</div>
	</div>
</section>

<style>
	section {
		background: #f9fafb;
	}
</style>
