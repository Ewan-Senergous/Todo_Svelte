<script lang="ts">
	import { Button, Heading, Input, Label, Select, Textarea } from 'flowbite-svelte';
	import { type Todo } from '$lib/todoSchema';

	type Props = {
		todo: Todo;
		action: string;
	};

	let { todo, action }: Props = $props();

	let mode: string = $derived(action === '/?createTodos' ? 'create' : 'edit');
	let title: string = $derived(mode === 'create' ? 'Créer une nouvelle tâche' : `Modifier tâche #${todo?.id}`);

</script>

<main class="container mx-auto p-6">
	<Heading tag="h1" class="mb-4 text-2xl font-bold">{title}</Heading>

	<section class="rounded border border-[#6c7280] bg-white p-6">
		<form method="POST" action={action} class="space-y-6">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label for="title">Titre</Label>
					<Input type="text" id="title" name="title" required value={todo?.title} />
				</div>
				<div>
					<Label for="priority">Priorité</Label>
					<Select id="priority" name="priority" value={todo?.priority}>
						<option value="low">Faible</option>
						<option value="medium" selected>Moyenne</option>
						<option value="high">Élevée</option>
					</Select>
				</div>
			</div>
			<div>
				<Label for="description">Description</Label>
				<Textarea id="description" name="description" value={todo?.description}></Textarea>
			</div>
			<div>
				<Label for="dueDate">Date limite</Label>
				<Input
					type="date"
					id="dueDate"
					name="dueDate"
					value={todo?.dueDate}
				/>
			</div>
			{#if mode === 'create'}
				<div>
					<Label for="completed">Statut</Label>
					<Select id="completed" name="completed" value={todo?.completed}>
						<option value="false" selected>En cours</option>
						<option value="true">Terminé</option>
					</Select>
				</div>
			{/if}
			<div class="flex justify-end space-x-4">
				<Button type="button" color="alternative" onclick={() => history.back()}>Annuler</Button>
				<Button type="submit" color="green">{mode === 'create' ? "Créer" : "Modifier"}</Button>
			</div>
		</form>
	</section>
</main>

<style>
    main {
        max-width: 800px;
    }
</style>
