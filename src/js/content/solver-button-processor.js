function initRevealButtons() {
    document.querySelectorAll("[data-reveal-label]").forEach((div) => {
        const label = div.getAttribute("data-reveal-label");
        const inner = div.innerHTML;

        div.innerHTML = `
            <button type="button" class="btn-base in-line-button">${label}</button>
            <div class="button-activated-div" style="display: none;">
                ${inner}
            </div>
        `;

        div.querySelector("button").addEventListener("click", function () {
            const content = div.querySelector("div");
            content.style.display = content.style.display === "none" ? "block" : "none";
        });
    });
}

// Make functions available globally
window.SolverButtonProcessor = {
    initRevealButtons,
};