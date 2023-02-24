import { PUBLIC_DEBUG } from "$env/static/public"
import { writable } from "svelte/store"


// debug
export const debug = writable( PUBLIC_DEBUG === 'true' )

// sidebar drawer control
export const drawerOpen = writable( false )