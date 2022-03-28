<script lang="ts">

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { tokenStore } from '$lib/stores';
	import Navbar from "$lib/Navbar.svelte"
	import Task from '$lib/task.svelte';
	import AddTask from "$lib/AddTask.svelte"

	interface task {
		id: Number
		title: String
		description: String
		creation_date: string
	}

	let tasks = [];

	let token: String;

	onMount(() => {

		tokenStore.subscribe(value => { token = value });

		if (token == "") {
			goto('/login', { replaceState: true });
		}

		fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
  		method: "GET",
  		headers: {
				'Authorization': `Bearer ${token}`,
    		Accept: "application/json",
    		"Content-Type": "application/json;charset=UTF-8",
  		}
		})
  	.then((response) => response.json())
  	.then((data) => {
			tasks = data.tasks;
		});
	});

	function onAdd(newTask: task) {
		tasks = [...tasks, newTask].sort((a: task, b: task) => (a.creation_date < b.creation_date) ? 1 : -1)
	};

	function onDelete(id: Number) {
		tasks = tasks.filter((item: task) => item.id != id);
	}

</script>

<Navbar/>
<div class="flex flex-col items-center justify-start bg-purple-100 absolute top-0 pt-16 w-full h-full">

	<div class="w-full overflow-y-auto mb-36 overflow-clip">
		{#each tasks as task}
			<Task task={task} deleteTask={onDelete} />
		{/each}
	</div>

	<AddTask add={onAdd} />

</div>
