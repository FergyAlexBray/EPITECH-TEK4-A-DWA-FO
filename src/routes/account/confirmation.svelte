<script lang="ts">

    import { page } from '$app/stores';
		import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    const token = $page.url.searchParams.get('token');

    onMount(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
  		method: "POST",
  		headers: {
				'Authorization': `Bearer ${token}`,
    		Accept: "application/json",
    		"Content-Type": "application/json;charset=UTF-8",
  		},
			body: JSON.stringify({
    		token: token
  		}),
		})
  	.then((response) => response.json())
  	.then((data) => {
			goto('/login')
		});
	});

</script>

<div>Confirmation...</div>
