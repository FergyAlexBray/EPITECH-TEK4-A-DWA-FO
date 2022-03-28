<script lang="ts">

	import { onMount } from 'svelte';

	import { profileImageStore, tokenStore } from '$lib/stores';
	import UserIcon from "$lib/icons/UserIcon.svelte"
	import Navbar from "$lib/Navbar.svelte"

	interface profile {
		profile_image: String
		username: String
		display_name: String
	}

	let token: String;
	let profileData: profile;
	let files;

	function updateProfil() {
		fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
  		method: "GET",
  		headers: {
				'Authorization': `Bearer ${token}`,
    		Accept: "application/json",
    		"Content-Type": "application/json;charset=UTF-8",
  		}
		})
  	.then((response) => response.json())
  	.then((data) => {
			profileData = data
			if (data.profile_image != null) {
				profileImageStore.update(currentValue => `${import.meta.env.VITE_API_URL}/uploads/images/${data.profile_image}`)
			}
		});
	}

	onMount(() => {
		tokenStore.subscribe(value => { token = value });
		updateProfil()
	});

	function sendImage() {
		if (files != undefined) {
			var reader = new FileReader();

      reader.onload = function(e) {
        var rawData = e.target.result;

				fetch(`${import.meta.env.VITE_API_URL}/api/profile/image`, {
  				method: "PUT",
  				headers: {
						'Authorization': `Bearer ${token}`,
    				Accept: "application/json",
    				"Content-Type": "application/json;charset=UTF-8",
  				},
  				body: JSON.stringify({
    				profile_image: rawData
  				}),
				})
  			.then((response) => response.json())
  			.then((data) => {
					updateProfil()
		  	});
			};

			reader.readAsDataURL(files[0])
		};
	};

	$: files, sendImage();

	function uploadImage() {
		document.getElementById('input_file').click();
	};

</script>

<Navbar/>
<div class="bg-purple-100 flex flex-col justify-center items-center w-full h-full top-0 absolute">
	{#if profileData != undefined}

		<div on:click={uploadImage} class="cursor-pointer hover:scale-105 m-16 flex items-center justify-center flex-col">
			{#if profileData.profile_image == null}
				<UserIcon color="gray" class="scale-150"/>
			{:else}
				<!-- [Profile image Here] -->
				<img class="max-h-40 max-w-40 rounded-3xl" src="{import.meta.env.VITE_API_URL}/uploads/images/{profileData.profile_image}" alt="profile_image" >
			{/if}
			<div class="text-slate-400 font-semibold text-xs">Click to change image</div>

			<input type="file" id='input_file' accept=".jpg, .jpeg, .png, .gif" bind:files hidden>
		</div>

		<div class="flex items-center justify-between font-semibold w-1/2">
			<div class="p-4 text-slate-700">Username:</div>
			<div class="text-purple-600">{profileData.display_name}</div>
		</div>

		<div class="flex items-center justify-between font-semibold w-1/2 pb-12">
			<div class="px-4 text-slate-700">Email:</div>
			<div class="text-purple-600">{profileData.username}</div>
		</div>

	{/if}
</div>
