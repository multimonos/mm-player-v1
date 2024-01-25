import { defineConfig } from "cypress"
import { svelte } from "@sveltejs/vite-plugin-svelte"


const e2ePort = 5718
const e2eBaseurl = `http://localhost:${e2ePort}`

export default defineConfig( {
    e2e: {
        watchForFileChanges: true,
        baseUrl: "http://localhost:5173",
        setupNodeEvents( on, config ) {
            // implement node event listeners here
        },
    },

    component: {
        watchForFileChanges: true,
        devServer: {
            framework: "svelte",
            bundler: "vite",
            viteConfig: () => {
                return {
                    plugins: [ svelte() ],
                    server: {
                        port: 5719, // force higher port
                        host: "127.0.0.1"
                    }
                }
            }
        },
    },
} )
