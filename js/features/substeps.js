/**
 * Substeps functionality
 * Manages visibility of substep elements based on user preferences
 */

/**
 * Shows or hides substep elements based on the check parameter
 */
function substeps(check) {
    let displayStyle;
    if (check) {
        displayStyle = 'block';
    } else {
        displayStyle = 'none';
    }

    let i = 1;
    while (true) {
        try {
            document.getElementById('substeps' + i).style.display = displayStyle;
        } catch (e) {
            break;
        }
        i++;
    }
}

/**
 * Initialize substeps based on localStorage setting
 */
function initSubsteps() {
    substeps((localStorage.getItem('substeps') === 'true'));
}

// Make functions available globally
window.FeatureUtils = {
    substeps,
    initSubsteps
};