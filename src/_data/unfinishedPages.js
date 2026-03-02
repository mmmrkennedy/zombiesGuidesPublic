import { JSDOM } from "jsdom";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function () {
    const indexPath = join(__dirname, "../index.html");
    const html = readFileSync(indexPath, "utf8");
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll("a.disabled");

    const paths = [];
    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href) {
            paths.push("/" + href);
        }
    });

    return paths;
}
