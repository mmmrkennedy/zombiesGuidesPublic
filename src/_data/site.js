export default {
    buildVersion: Date.now(),
    bundled: process.env.BUNDLE === "true",
    name: "Zombies Guides",
    url: process.env.NODE_ENV === "production" ? "https://mmmrkennedy.com" : "http://localhost:8080",
};
