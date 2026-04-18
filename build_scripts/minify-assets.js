import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify as terserMinify } from "terser";
import CleanCSS from "clean-css";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "..", "dist");

function findFiles(dir, extensions) {
    const files = [];

    function traverse(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === "react-solvers") continue;
                traverse(fullPath);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (extensions.includes(ext) && !entry.name.endsWith(".min.css") && !entry.name.endsWith(".min.js")) {
                    files.push(fullPath);
                }
            }
        }
    }

    traverse(dir);
    return files;
}

async function minifyCSS(filePath) {
    try {
        const output = new CleanCSS({}).minify([filePath]);
        if (output.errors.length) throw new Error(output.errors.join(", "));
        fs.writeFileSync(filePath, output.styles, "utf8");
        // console.log(`✅ CSS: ${path.relative(distDir, filePath)}`);
    } catch (error) {
        console.error(`❌ Error minifying ${filePath}:`, error.message);
    }
}

async function minifyJS(filePath) {
    try {
        const input = fs.readFileSync(filePath, "utf8");
        const result = await terserMinify(input, { compress: true, mangle: true });
        if (!result.code) throw new Error("terser returned no output");
        fs.writeFileSync(filePath, result.code, "utf8");
        // console.log(`✅ JS:  ${path.relative(distDir, filePath)}`);
    } catch (error) {
        console.error(`❌ Error minifying ${filePath}:`, error.message);
    }
}

// console.log("🚀 Starting asset minification...\n");

if (!fs.existsSync(distDir)) {
    console.error("❌ dist directory not found. Run build first.");
    process.exit(1);
}

const cssFiles = findFiles(distDir, [".css"]);
const jsFiles = findFiles(distDir, [".js"]);

// console.log(`Found ${cssFiles.length} CSS files and ${jsFiles.length} JS files\n`);

await Promise.all([
    ...cssFiles.map(minifyCSS),
    ...jsFiles.map(minifyJS),
]);

// console.log("\n✨ Minification complete!");
