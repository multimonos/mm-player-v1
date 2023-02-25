/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{svelte,js,ts,html}',
    ],
    plugins: [
        require( "@tailwindcss/typography" ),
        require( "daisyui" )
    ],
    daisyui: {
        styled: true,
        themes: [
            {
                multimonos: {
                    "primary": "#f9a8d4",
                    "secondary": "#fee2e2",
                    "accent": "#fef08a",
                    "neutral": "#110E0E",
                    "base-100": "#171212",
                    "info": "#3ABFF8",
                    "success": "#36D399",
                    "warning": "#FBBD23",
                    "error": "#F87272",
                }
            }
        ],
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        prefix: "",
        darkTheme: "dark",
    }
}
