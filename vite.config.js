import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to serve the games directory during development
function serveGamesDirectory() {
    return {
        name: 'serve-games-directory',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                // Check if request is for a file in /games/
                if (req.url && req.url.startsWith('/games/')) {
                    const filePath = path.join(__dirname, 'src', req.url);
                    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                        // Serve the file
                        const ext = path.extname(filePath);
                        const contentTypes = {
                            '.webp': 'image/webp',
                            '.png': 'image/png',
                            '.jpg': 'image/jpeg',
                            '.jpeg': 'image/jpeg',
                            '.svg': 'image/svg+xml',
                            '.gif': 'image/gif'
                        };
                        res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
                        fs.createReadStream(filePath).pipe(res);
                        return;
                    }
                }
                next();
            });
        }
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), serveGamesDirectory()],

    // Serve from react-solvers directory for dev server
    root: path.resolve(__dirname, './src/react-solvers'),

    // Set the base URL for assets
    base: '/',

    // Explicitly set publicDir to false since we're handling static files with our custom middleware
    publicDir: false,

    // Tell Vite where the index.html is for dev server
    server: {
        open: true, // Just open the root index.html
    },

    // Exclude styles.css from being processed/bundled
    css: {
        preprocessorOptions: {
            // This won't work for plain CSS, see build.rollupOptions instead
        },
    },

    // Build configuration
    build: {
        // Output directory for built files (builds from src/react-solvers to dist/react-solvers)
        outDir: path.resolve(__dirname, './dist/react-solvers'),

        // Clear the output directory before building
        emptyOutDir: true,

        // Generate source maps for debugging
        sourcemap: true,

        // Generate manifest for dynamic bundle resolution
        manifest: true,

        // Make the bundle accessible as a global
        rollupOptions: {
            input: path.resolve(__dirname, 'src/react-solvers/index.html'),
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
