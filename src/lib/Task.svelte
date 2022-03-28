<script lang="ts">

	import { tokenStore } from "./stores";
	import TrashIcon from "./icons/TrashIcon.svelte";
	import FileIcon from "./icons/FileIcon.svelte"

	interface taskData {
		id: Number
		filename: String
		original_name: String
	}

	interface task {
		id: Number
		title: String
		description: String
		creation_date: string
		attachments: [taskData]
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

	function download(filename: String) {
		window.open(`${import.meta.env.VITE_API_URL}/uploads/task/${filename}`)
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

		{#if task.attachments.length > 0}
			{#each task.attachments as attachment}
				<div on:click={() => download(attachment.filename)} class="flex items-center bg-purple-100 rounded p-2 shadow my-2 mx-4 w-fit hover:scale-105 cursor-pointer">
					<div class="pl-2"><FileIcon color="rgb(147, 51, 234)"/></div>
					<div class="font-semibold pl-2 text-purple-600">{attachment.original_name}</div>
				</div>
			{/each}
		{/if}

	</div>
</div>
