import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter()
    },
    preprocess: vitePreprocess(),
    onwarn: ( warning, handler ) => {
        if ( warning.code === "a11y-click-events-have-key-events" ) return;
        handler( warning )
    }
};

export default config;
