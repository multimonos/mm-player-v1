import { defineConfig } from "cypress"
import { svelte } from "@sveltejs/vite-plugin-svelte"


export default defineConfig( {
    e2e: {
        setupNodeEvents( on, config ) {
            // implement node event listeners here
        },
    },

    component: {
        devServer: {
            framework: "svelte",
            bundler: "vite",
            viteConfig: () => {
                return {
                    plugins: [ svelte() ],
                    server: {
                        port: 5713,
                        host: "127.0.0.1"
                    }
                }
            }
        },
    },
} )
