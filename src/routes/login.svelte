<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
  import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';

	import { tokenStore, emailStore } from "$lib/stores"

  let email: String;
  let password: String;
	let isSignIn: boolean = true;

	let token;

	onMount(() => {
		tokenStore.subscribe(value => { token = value });

		if (token != "") {
			goto('/', { replaceState: true });
		};
	});

	function toggleSignIn() { isSignIn = !isSignIn };

	function signIn() {
		fetch(`${import.meta.env.VITE_API_URL}/api/auth/${isSignIn ? 'signin' : 'signup'}`, {
  		method: "POST",
  		headers: {
    		Accept: "application/json",
    		"Content-Type": "application/json;charset=UTF-8",
  		},
  		body: JSON.stringify({
    		username: email,
    		password: password,
  		}),
		})
  	.then((response) => response.json())
  	.then((data) => {
			if (isSignIn) {
				emailStore.update(currentValue => data.username)
				tokenStore.update(currentValue => data.access_token)
				goto('/', { replaceState: true })
			} else {
				console.log(data);
			}
  	});
	}

</script>

<div class="flex flex-col items-center justify-center bg-purple-100 h-screen w-screen">
	<div class="flex justify-center text-3xl font-bold pb-4 text-slate-600">Attack and Defend</div>

  <div class="shadow bg-purple-200 rounded-xl px-4 py-3 flex flex-col w-max">

		{#if typeof document != 'undefined' }
			<LottiePlayer src="login.json" autoplay="{true}" loop="{true}" controls="{false}" renderer="svg" background="transparent" height="{170}" width="{300}" controlsLayout="{[]}"/>
		{/if}

    <input bind:value={email} placeholder="Email" class="bg-purple-100 rounded-lg p-3 m-2 shadow font-semibold hover:scale-105 cursor-text">

    <input bind:value={password} type="password" placeholder="Password" class="bg-purple-100 rounded-lg p-3 m-2 shadow font-semibold hover:scale-105 cursor-text">

		<div on:click={signIn} class="font-semibold flex items-center justify-center text-xl text-slate-200 bg-purple-600 shadow rounded-lg py-2 m-2 cursor-pointer select-none hover:scale-105">{isSignIn ? 'Sign In' : 'Register'}</div>

		<div class="flex justify-around">
			<div class="flex justify-center font-semibold text-sm my-3 text-slate-500 hover:scale-105 select-none cursor-pointer">Forgot password</div>
			<div on:click={toggleSignIn} class="flex justify-center font-semibold text-sm my-3 text-purple-600 hover:scale-105 select-none cursor-pointer">{isSignIn ? 'Create an account' : 'Sign In'}</div>
		</div>

  </div>
</div>
