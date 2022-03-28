<script lang="ts">

	import { tokenStore } from "$lib/stores"

	export let add;

	let title: String
	let description: String
	let files;
	let dataFile = null;

	let token;
	tokenStore.subscribe(value => { token = value });

	function withoutUpload() {
		fetch(`${import.meta.env.VITE_API_URL}/api/task/no-file`, {
  		method: "POST",
  		headers: {
				'Authorization': `Bearer ${token}`,
    		Accept: "application/json",
    		"Content-Type": "application/json;charset=UTF-8",
  		},
			body: JSON.stringify({
    		title: title,
				description: description
  		}),
		})
  	.then((response) => response.json())
  	.then((data) => {
			add(data);
			title = ""
			description = ""
			files = undefined
			document.getElementById('fileUpload').value = "";
		});
	}

	function withUpload() {
    const formData = new FormData();
		formData.append('filename', files[0]);
		formData.append('title', title);
		formData.append('description', description);

		fetch(`${import.meta.env.VITE_API_URL}/api/task/with-file`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
  		},
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			add(data);
			title = ""
			description = ""
			files = undefined
			document.getElementById('fileUpload').value = "";
		})
  };

	function createTask() {
		if (title == undefined || description == undefined) { return }
		if(files) {
			withUpload()
		} else {
			withoutUpload()
		}
	};

	function clearFiles() {
		files = undefined
		document.getElementById('fileUpload').value = "";
	};

</script>

<div class="fixed flex items-center justify-between w-full bottom-0 px-8 shadow bg-purple-200 rounded-xl">

	<div class="flex flex-col justify-evenly py-4 w-full pr-6">
		<div class="flex items-center">
			<div class="font-semibold mr-6">Title:</div>
			<input class="bg-purple-100 shadow p-2 my-2 rounded-lg w-full" bind:value={title}>
		</div>

		<div class="flex items-center">
			<div class="font-semibold mr-6">Description:</div>
			<input class="bg-purple-100 shadow p-2 my-2 rounded-lg w-full" bind:value={description}>
		</div>
	</div>

	<div class="flex item-center justify-center relative">
		<input class="bg-purple-100 rounded-lg p-4 m-4" id="fileUpload" type="file" bind:files>
		<div on:click={clearFiles} class="absolute right-8 top-9 font-extrabold text-red-600 cursor-pointer hover:text-purple-600 {files ? 'scale-110' : 'scale-0'}">X</div>
	</div>

  <div on:click={createTask} class="flex bg-emerald-400 text-slate-100 p-3 font-semibold text-lg rounded-lg hover:scale-105 cursor-pointer select-none">Add</div>

</div>