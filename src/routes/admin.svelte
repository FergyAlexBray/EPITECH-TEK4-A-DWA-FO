<script lang="ts">

	import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

	import { profileImageStore, emailStore, tokenStore } from '$lib/stores';
	import LogoutIcon from "$lib/icons/LogoutIcon.svelte";
	import FileIcon from "$lib/icons/FileIcon.svelte"
	import TrashIcon from "$lib/icons/TrashIcon.svelte"

	let token: String;

	let users = [
		{
			email: "test@test.fr",
			tasks: [
				{
					id: 1,
					title: "test task 1",
					description: "this is the first test task",
					creation_date: "2022-03-29T14:01:11.000Z"
				},
				{
					id: 46,
					title: "test task 2",
					description: "this is the second test task",
					creation_date: "2022-03-29T14:01:11.000Z",
					attachments: [
						{
							id: 21,
							filename: "9.5f28b53f-ef9f-474e-944c-5fd22a6cd0f1.x-bittorrent",
							original_name: "Permis côtier et fluvial 2015.torrent"
						}
					]
				},
			]
		},
		{
			email: "mathieu-n@test.fr",
			tasks: [
				{
					id: 1,
					title: "test task 4",
					description: "this is the fourth test task",
					creation_date: "2022-03-29T14:01:11.000Z"
				},
				{
					id: 46,
					title: "test task 6",
					description: "this is the sixth test task",
					creation_date: "2022-03-29T14:01:11.000Z",
					attachments: [
						{
							id: 21,
							filename: "9.5f28b53f-ef9f-474e-944c-5fd22a6cd0f1.x-bittorrent",
							original_name: "Permis côtier et fluvial 2015.torrent"
						}
					]
				},
			]
		}
	];

	let selectedUser;

	function refreshUsers() {
		fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
			method: "GET",
			headers: {
				'Authorization': `Bearer ${token}`,
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			}
		})
		.then((response) => response.json())
		.then((data) => {
			console.log(data)
			users = data
		});
	};

  onMount(() => {

		tokenStore.subscribe(value => { token = value });

		if (token == "") {
			goto('/login', { replaceState: true });
		}

		refreshUsers();
	});

	function clickLogout() { goto('/') };

	function selectUser(user) { selectedUser = user };

	function formatDate(originalDate): string {
    let date = new Date(Date.parse(originalDate.creation_date));

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
  }

	function deleteTask(id) {
		fetch(`${import.meta.env.VITE_API_URL}/api/admin/deleteTask`, {
  		method: "DELETE",
  		headers: {
				'Authorization': `Bearer ${token}`,
    		Accept: "application/json",
    		"Content-Type": "application/json;charset=UTF-8",
  		},
  		body: JSON.stringify({
    		task_id: id,
  		}),
		})
  	.then((response) => response.json())
  	.then((data) => {
			if (data.message == "Task has been deleted successfully.") {
				selectedUser.tasks = selectedUser.tasks.filter((item) => item.id != id);
				refreshUsers();
			};
  	});
	}

</script>

<div class="bg-indigo-100 w-full h-screen flex flex-col items-center justify-center font-semibold">
	<div class="bg-indigo-200 w-full h-16 flex items-center justify-between pr-6 shadow">
		<div class="pl-6">Admin panel</div>
		<div on:click={clickLogout} class="hover:scale-105 antialiased cursor-pointer">
			<LogoutIcon color="red" />
		</div>
	</div>

	<div class="h-full w-full flex">
  	{#if users}
			<div class="{selectedUser ? 'w-1/2' : 'w-full'} h-full flex flex-col items-start justify-start">
				<div class="m-2 text-lg text-slate-400 ml-6 pt-4" >Users:</div>

				{#each users as user}
					<div on:click={() => selectUser(user)} class="bg-indigo-200 p-4 rounded-xl shadow m-2 ml-4 flex items-center justify-between hover:scale-105 antialiased cursor-pointer">
						<div class="pr-3">{user.email}</div>
						<div class="text-sm text-slate-400">({user.tasks.length} tasks)</div>
					</div>
				{/each}

			</div>

			{#if selectedUser}
				<div class="bg-indigo-200 w-1/2 flex flex-col items-center shadow rounded-lg m-4">
					<div class="flex justify-end w-full p-4">
						<div on:click={() => selectUser(null)} class="bg-red-400 text-white p-2 text-center shadow rounded-lg hover:scale-105 antialiased cursor-pointer">Close</div>
					</div>

					<div class="p-2 text-lg text-indigo-800">
						{selectedUser.email}
					</div>

					{#each selectedUser.tasks as task}
						<div class="bg-indigo-100 p-2 pl-4 pt-3 m-2 rounded-lg w-[96%] flex items-center justify-between">

							<div>
								<div>{task.title}</div>
								<div class="text-slate-500 pl-1" >{task.description}</div>
								{#if task.attachments}
									{#each task.attachments as attachment}
										<div class="text-indigo-600 flex items-center pl-1">
											<div class="pr-2" ><FileIcon color="blue" /></div>
											<div>{attachment.original_name}</div>
										</div>
									{/each}
								{/if}
							</div>

							<div on:click={() => deleteTask(task.id)} class="hover:scale-105 antialiased cursor-pointer mr-4">
								<TrashIcon color="red"/>
							</div>

						</div>
					{/each}
				</div>
			{/if}

		{/if}
	</div>
</div>
