<script lang="ts">

	import { tokenStore } from "./stores";
	import TrashIcon from "./icons/TrashIcon.svelte";

	interface task {
		id: Number
		title: String
		description: String
		creation_date: string
	}

	export let task: task;
	export let deleteTask;

	let token;
	tokenStore.subscribe(value => { token = value });

	function formatDate(): string {
    let date = new Date(Date.parse(task.creation_date));

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
  }

	function removeTask() {
		fetch(`${import.meta.env.VITE_API_URL}/api/task`, {
  		method: "DELETE",
  		headers: {
				'Authorization': `Bearer ${token}`,
    		Accept: "application/json",
    		"Content-Type": "application/json;charset=UTF-8",
  		},
  		body: JSON.stringify({
    		task_id: task.id,
  		}),
		})
  	.then((response) => response.json())
  	.then((data) => {
			if (data.message == "Task has been deleted successfully.") {
				deleteTask(task.id)
			};
  	});
	};

</script>

<div class="flex flex-col w-full px-4 my-4 hover:scale-[1.01]">
	<div class="bg-purple-200 shadow-lg rounded-lg p-2">

		<div class="flex justify-between px-2">
  		<div class="font-semibold">{task.title}</div>
			<div class="text-slate-500">{formatDate()}</div>
		</div>

		<div class="flex justify-between items-center px-2">
			<div class="font-medium pl-3">{task.description}</div>
			<div on:click={removeTask} class="hover:scale-105 cursor-pointer select-none"><TrashIcon color="red" /></div>
		</div>

	</div>
</div>
