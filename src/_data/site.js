const version = Date.now();

export default {
    buildVersion: version,
    buildVersionShort: version.toString().slice(-6),
    bundled: process.env.BUNDLE === "true",
    name: "Zombies Guides",
    url: process.env.NODE_ENV === "production" ? "https://mmmrkennedy.com" : "http://localhost:8080",
};
