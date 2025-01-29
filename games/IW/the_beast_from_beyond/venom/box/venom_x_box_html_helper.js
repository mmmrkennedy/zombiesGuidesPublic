const colours = ['red', 'green', 'blue', 'black', 'yellow', 'white'];

function addVenomXButtons(count) {
    // Get the target div
    const container = document.getElementById("venom-x-box-buttons");

    // Ensure the container exists
    if (!container) {
        console.error("Element with ID 'venom-x-box-buttons' not found.");
        return;
    }

    // Clear the container to avoid duplicates
    container.innerHTML = "";

    // Create and append the select elements
    for (let i = 0; i < count; i++) {
        let id = `venom-button`;

        // Create a wrapper div for proper alignment
        const wrapper = document.createElement("div");
        wrapper.className = "venom-row";

        const label = document.createElement("label");
        label.id = `label-${id}`;
        label.htmlFor = id;
        label.textContent = `Button ${i + 1}: `;
        wrapper.appendChild(label);

        const select = document.createElement("select");
        select.name = id;
        select.id = id;

        // Add onchange event to the select
        select.onchange = venom_box_solve;

        // Optionally, add some sample options to each select
        for (let j = 0; j < colours.length; j++) {
            const option = document.createElement("option");
            option.value = `${colours[j]}`;
            option.textContent = `${colours[j]}`;
            select.appendChild(option);
        }

        wrapper.appendChild(select);

        // Append the wrapper to the main container
        container.appendChild(wrapper);
    }
}

function add_colour_selectors() {
    const buttons_selector = document.getElementById("venom-x-box-button-selector");

    document.getElementById("venom-x-box-result").innerHTML = "";

    for (let i = 0; i < buttons_selector.length; i++) {
        if (buttons_selector[i].selected === true) {
            addVenomXButtons(buttons_selector[i].value);
            return;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    add_colour_selectors()
});