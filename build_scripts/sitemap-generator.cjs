#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { SitemapStream, streamToPromise } = require("sitemap");
const { execSync } = require("child_process");

const SITE_URL = "https://mmmrkennedy.com"; // Change to your site
const INDEX_FILE = path.resolve("./dist/index.html"); // Path to your index.html
const OUTPUT_FILE = path.resolve("./dist/sitemap.xml");

function getGitLastModified(link) {
    try {
        // link is something like "games/BO6/terminus/terminus_guide.html"
        // find the source file in src/ or wherever your Eleventy input is
        const result = execSync(
            `git log -1 --format="%cI" -- "${link}"`,
            { encoding: "utf8" }
        ).trim();
        return result || null;
    } catch {
        return null;
    }
}

async function buildSitemap() {
    if (!fs.existsSync(INDEX_FILE)) {
        console.error(`Index file not found: ${INDEX_FILE}`);
        process.exit(1);
    }

    const html = fs.readFileSync(INDEX_FILE, "utf8");
    const dom = new JSDOM(html);

    const links = Array.from(dom.window.document.querySelectorAll("a"))
        .filter((a) => !a.classList.contains("disabled")) // skip disabled links
        .map((a) => a.getAttribute("href"))
        .filter((href) => href && !href.startsWith("http") && !href.startsWith("#")) // only relative links
        .map((href) => href.replace(/^\/?/, "")) // normalize
        .map((href) => href.replace(/\?.*$/, "")); // remove query string ".html?foo"
        // .map((href) => href.replace(/\.html$/, "")); // remove .html extension

    const uniqueLinks = [...new Set(links)];

    if (uniqueLinks.length === 0) {
        console.error("No valid links found in index.html");
        process.exit(1);
    }

    const sitemap = new SitemapStream({ hostname: SITE_URL });

    // include the homepage first
    sitemap.write({ url: "/", lastmod: fs.statSync(INDEX_FILE).mtime });

    // then add all linked pages
    for (const link of uniqueLinks) {
        const filePath = path.resolve("./src", link);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const lastmod = getGitLastModified(filePath) || stats.mtime;
            sitemap.write({ url: `/${link}`, lastmod });
        }
    }

    sitemap.end();
    const data = await streamToPromise(sitemap);
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, data.toString());

    console.log(`sitemap.xml generated with ${uniqueLinks.length} pages`);
}

buildSitemap();
