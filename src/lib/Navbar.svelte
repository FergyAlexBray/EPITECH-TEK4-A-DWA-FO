<script lang="ts">

  import { goto } from '$app/navigation';

  import { profileImageStore, emailStore, tokenStore } from '$lib/stores';
  import LogoutIcon from "./icons/LogoutIcon.svelte";
  import UserIcon from "./icons/UserIcon.svelte";

	let profileImageURL;
	let email;

	profileImageStore.subscribe(value => { profileImageURL = value });
	emailStore.subscribe(value => { email = value });

	function clickHome() { goto('/') }
	function clickProfile() { goto('/profile') }
	function clickAdmin() { goto('/admin') }

	function logout() {
		tokenStore.update(currentValue => "")
		emailStore.update(currentValue => "")
		profileImageStore.update(currentValue => "")
		goto('/login')
	}

</script>

<div class="sticky z-50 top-0 bg-purple-100 shadow w-full flex justify-between items-center">

  <div class="font-semibold p-4 select-none hover:scale-105 antialiased cursor-pointer" on:click={clickHome}>Attack and Defend</div>

  <div class="flex items-center">
	<div on:click={clickAdmin} class="font-semibold pr-8 hover:scale-105 antialiased cursor-pointer" >Admin panel</div>

    <div class="flex items-center hover:scale-105 antialiased cursor-pointer" on:click={clickProfile}>
			<div class="font-semibold">{email}</div>
			{#if profileImageURL != null && profileImageURL != ""}
				<img class="max-h-8 max-w-8 rounded-lg ml-3" src={profileImageURL} alt="profile_image" >
			{:else}
				<UserIcon color="black" class="p-4"/>
			{/if}
		</div>

		<div class="font-bold pl-3 text-slate-600">|</div>

		<div on:click={logout} class="overflow-clip">
    	<LogoutIcon color="red" class="p-4 hover:scale-105 antialiased cursor-pointer"/>
		</div>

  </div>
</div>
