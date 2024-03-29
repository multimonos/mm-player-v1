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
            "dark", "forest",
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
    },
    theme: {
        extend: {
            height: {
                '100vw': '100vw'
            },
            gridAutoRows: {
                'albumgrid': '26.25rem',
                'albumhero-md': '24rem',
                'albumhero-lg': '32rem',
                'viewwidth': '100vw'
            }
        }
    }
}
