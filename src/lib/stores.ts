import { writable } from "svelte/store";
import { browser } from "$app/env";

export const tokenStore = writable(browser && localStorage.getItem("token") || "");
tokenStore.subscribe((newValue) => {
    if (browser) return (localStorage.token = newValue)
});

export const emailStore = writable(browser && localStorage.getItem("email") || "");
emailStore.subscribe((newValue) => {
    if (browser) return (localStorage.email = newValue)
});

export const profileImageStore = writable(browser && localStorage.getItem("profileImage") || "");
profileImageStore.subscribe((newValue) => {
    if (browser) return (localStorage.profileImage = newValue)
});
