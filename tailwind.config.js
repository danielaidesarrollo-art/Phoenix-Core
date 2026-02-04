/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: '#1a3a5f',
                    lightblue: '#2c5282',
                    accent: '#3182ce',
                }
            }
        },
    },
    plugins: [],
}
