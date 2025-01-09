<script lang="ts">

	import Form from '$lib/components/Form.svelte';
	import { type Todo } from '$lib/todoSchema';

	let newTodo: Todo = $state({
		id: 0,
		title: '',
		priority: 'medium',
		description: '',
		dueDate: new Date(),
		completed: false,
		order: 0
	});

</script>

<Form action="/?createTodos" todo={newTodo} />