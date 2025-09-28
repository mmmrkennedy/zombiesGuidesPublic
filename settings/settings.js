// Theme colour handling
document.addEventListener('DOMContentLoaded', function() {
    let savedcolourMode = localStorage.getItem('colourMode');
    console.log(savedcolourMode);
    if(savedcolourMode === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
});

// Listen for local storage changes and reload the page if necessary
window.addEventListener('storage', function(event) {
    if (event.key === 'preload' || event.key === 'colourMode') {
        console.log('Storage event detected!')
        location.reload();  // Reload the current page
    }
});

// Settings handling
document.addEventListener('DOMContentLoaded', function() {
    // Remove preloadVideo from local storage, due to functionality removal
    localStorage.removeItem('preloadVideo');
    localStorage.removeItem('substeps');

    const colourModeSelect = document.getElementById('colourMode');
    const preloadInput = document.getElementById('preload');
    const closeSettingAutoInput = document.getElementById('close_setting_auto');

    // Load and set values from local storage
    const savedColourMode = localStorage.getItem('colourMode');
    const savedPreloadValue = (localStorage.getItem('preload') === 'true');
    const savedCloseSettingAutoValue = (localStorage.getItem('close_setting_auto') === 'true');

    if (savedColourMode) {
        colourModeSelect.value = savedColourMode;
    }

    preloadInput.checked = savedPreloadValue;
    closeSettingAutoInput.checked = savedCloseSettingAutoValue;

    // Save button click event listener
    const saveButton = document.querySelector('button');
    saveButton.addEventListener('click', function() {
        // Remove preloadVideo from local storage, due to functionality removal
        localStorage.removeItem('preloadVideo');

        const colourModeValue = colourModeSelect.value;
        const preloadValue = preloadInput.checked;
        const closeSettingAutoValue = closeSettingAutoInput.checked;

        // Save values to local storage
        localStorage.setItem('colourMode', colourModeValue);
        localStorage.setItem('preload', preloadValue.toString());
        localStorage.setItem('close_setting_auto', closeSettingAutoValue.toString());

        checkSettingsSaved(colourModeValue, preloadValue.toString(), closeSettingAutoValue.toString());
    });
});

// Utility functions for settings
function checkSettingsSaved(colourModeValue, preloadValue, close_setting_auto_value) {
    const settingsSaved =
        colourModeValue === localStorage.getItem('colourMode') &&
        preloadValue === localStorage.getItem('preload') &&
        close_setting_auto_value === localStorage.getItem('close_setting_auto') &&

    changeText(settingsSaved ? "Settings Saved!" : "Settings Failed to Save! Please try again.");
}


function changeText(text) {
    let paragraph = document.getElementById('saveSettingsText');
    paragraph.innerText = text;
    if(localStorage.getItem('close_setting_auto') === 'true') {
        setTimeout(function () {
            window.close();
        }, 800); // 800 milliseconds or 0.8 seconds

    } else {
        setTimeout(function () {
            paragraph.innerText = '';
        }, 3000); // 3000 milliseconds or 3 seconds

    }
}