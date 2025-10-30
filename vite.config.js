import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],

    // Serve from project root so /css/styles.css works
    root: './',

    // Tell Vite where the index.html is for dev server
    server: {
        open: '/react-solvers/index.html',
    },

    // Exclude styles.css from being processed/bundled
    css: {
        preprocessorOptions: {
            // This won't work for plain CSS, see build.rollupOptions instead
        },
    },

    // Build configuration
    build: {
        // Output directory for built files
        outDir: 'react-solvers/dist',

        // Clear the output directory before building
        emptyOutDir: true,

        // Generate source maps for debugging
        sourcemap: true,

        // Make the bundle accessible as a global
        rollupOptions: {
            input: path.resolve(__dirname, 'react-solvers/index.html'),
            output: {
                // This ensures our mount functions are available globally
                format: 'iife',
                name: 'ZombiesSolvers',
            },
            // Exclude styles.css from being bundled
            external: ['/css/styles.css', 'css/styles.css'],
        },
    },
});
