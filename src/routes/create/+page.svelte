<main class="container mx-auto p-6">
	<h1 class="mb-4 text-2xl font-bold">Créer une nouvelle tâche</h1>

	<section class="rounded border border-[#6c7280] bg-white p-4">
		<form method="POST" action="?/createTodo" class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="title" class="block text-sm font-medium">Titre</label>
					<input type="text" id="title" name="title" required class="w-full rounded border p-2" />
				</div>
				<div>
					<label for="priority" class="block text-sm font-medium">Priorité</label>
					<select id="priority" name="priority" class="w-full rounded border p-2">
						<option value="low">Faible</option>
						<option value="medium" selected>Moyenne</option>
						<option value="high">Élevée</option>
					</select>
				</div>
			</div>
			<div>
				<label for="description" class="block text-sm font-medium">Description</label>
				<textarea id="description" name="description" class="w-full rounded border p-2"></textarea>
			</div>
			<div>
				<label for="dueDate" class="block text-sm font-medium">Date limite</label>
				<input
					type="date"
					id="dueDate"
					name="dueDate"
					value={new Date().toISOString().split('T')[0]}
					class="w-full rounded border p-2"
				/>
			</div>
			<div>
				<label for="completed" class="block text-sm font-medium">Statut</label>
				<select id="completed" name="completed" class="w-full rounded border p-2">
					<option value="false" selected>En cours</option>
					<option value="true">Terminé</option>
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
