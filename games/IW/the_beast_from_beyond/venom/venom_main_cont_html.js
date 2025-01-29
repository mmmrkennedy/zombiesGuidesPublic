const venom_y_main_container = document.getElementById("venom-y-main-container");
const venom_y_archer = document.getElementById("venom-y-archer");
const venom_y_cross = document.getElementById("venom-y-cross");
const venom_y_key_selector = document.getElementById('venom-y-key-selector');

function toggleKeyText(selectedValue, name) {
    // Add additional logic here based on the selected value
    if (selectedValue !== "default") {
        venom_y_main_container.style.display = "block";
    } else {
        venom_y_main_container.style.display = "none";
    }

    if (selectedValue === "archer") {
        venom_y_cross.style.display = "none";
        venom_y_archer.style.display = "block";

    } else if (selectedValue === "cross") {
        venom_y_archer.style.display = "none";
        venom_y_cross.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    venom_y_key_selector.value = "default";
    toggleKeyText("default", undefined);
});
