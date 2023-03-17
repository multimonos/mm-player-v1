import { PUBLIC_DEBUG } from "$env/static/public"
import { get, writable } from "svelte/store"


// debug
export const debug = writable( PUBLIC_DEBUG === 'true' )

// sidebar drawer control
export const drawerOpen = writable( false )

// fns
export const openDrawer = () =>
    drawerOpen.set( true )

export const closeDrawer = () =>
    drawerOpen.set( false )

export const toggleDrawer = () => {
    const v = get( drawerOpen )
    drawerOpen.set( ! v )
}