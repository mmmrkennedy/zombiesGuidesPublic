// S.A.M. Files Database - ordered by archived date (oldest to latest)
const samFiles = [
    { number: 6, name: 'BND Badge', date: '6/28/1985', order: 1 },
    { number: 1, name: 'Notso\'s Collar', date: '7/15/1985', order: 2 },
    { number: 3, name: 'Scarf', date: '8/21/1985', order: 3 },
    { number: 4, name: 'Wristwatch', date: '9/2/1985', order: 4 },
    { number: 5, name: 'Combat Goggles', date: '10/12/1985', order: 5 },
    { number: 2, name: 'Katana', date: '12/8/1985', order: 6 }
];

function updateMaxisResult() {
    const resultsContainer = document.getElementById('maxis-results-container');
    const file1 = document.getElementById('file1').value;
    const file2 = document.getElementById('file2').value;
    const file3 = document.getElementById('file3').value;
    const file4 = document.getElementById('file4').value;

    if (!resultsContainer) {
        return;
    }

    if (file1 && file2 && file3 && file4) {
        // Get the selected files and sort them chronologically
        const selectedNumbers = [file1, file2, file3, file4];
        const selectedFiles = selectedNumbers.map(num => 
            samFiles.find(file => file.number == num)
        ).filter(file => file); // Remove any undefined files
        
        // Sort by chronological order (order property)
        selectedFiles.sort((a, b) => a.order - b.order);
        
        // Create the 4-digit number from chronologically sorted files
        const fourDigitNumber = selectedFiles.map(file => file.number).join('');
        resultsContainer.innerHTML = `<p id="maxis-result">Code: ${fourDigitNumber}</p>`;
    } else {
        resultsContainer.innerHTML = '<p id="maxis-result">Select 4 files...</p>';
    }
}

function resetMaxisSolver() {
    document.getElementById('file1').value = '';
    document.getElementById('file2').value = '';
    document.getElementById('file3').value = '';
    document.getElementById('file4').value = '';
    updateDropdownOptions();
    updateMaxisResult();
}

// Function to update dropdown options to prevent duplicates
function updateDropdownOptions() {
    const selects = document.querySelectorAll('select[id^="file"]');
    const selectedValues = Array.from(selects).map(select => select.value).filter(val => val);
    
    selects.forEach(select => {
        const currentValue = select.value;
        const options = select.querySelectorAll('option');
        
        options.forEach(option => {
            if (option.value === '') {
                // Always show the "Select file..." option
                option.style.display = 'block';
            } else if (option.value === currentValue) {
                // Always show the currently selected option
                option.style.display = 'block';
            } else if (selectedValues.includes(option.value)) {
                // Hide options that are already selected in other dropdowns
                option.style.display = 'none';
            } else {
                // Show available options
                option.style.display = 'block';
            }
        });
    });
}

// Function to set up event listeners
function setupEventListeners() {
    const selects = document.querySelectorAll('select[id^="file"]');

    if (!selects.length) {
        return false;
    }

    // Check if listeners already set up
    if (selects[0].hasAttribute('data-listeners-set')) {
        return true;
    }

    // Add event listeners to all selects
    selects.forEach(select => {
        select.addEventListener('change', function() {
            updateDropdownOptions();
            updateMaxisResult();
        });
        select.setAttribute('data-listeners-set', 'true');
    });

    return true;
}

// Function to initialize the maxis solver
function initializeMaxisSolver() {
    console.log('Initializing maxis solver');
    
    if (!setupEventListeners()) {
        setTimeout(function () {
            if (!setupEventListeners()) {
                setTimeout(setupEventListeners, 1000);
            }
        }, 500);
    }
    // Initialize dropdown options
    updateDropdownOptions();
}

// Try to set up listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initializeMaxisSolver();
});

// Also try when window loads (fallback)
window.addEventListener('load', function () {
    const selects = document.querySelectorAll('select[id^="file"]');
    if (selects.length > 0 && !selects[0].hasAttribute('data-listeners-set')) {
        setupEventListeners();
    }
    // Initialize dropdown options
    updateDropdownOptions();
});

// For dynamic loading - expose the initialization function globally
window.initializeMaxisSolver = initializeMaxisSolver;

// Listen for the custom event when this solver is loaded dynamically
document.addEventListener('maxis_items_solver', function() {
    console.log('Maxis solver loaded dynamically, initializing...');
    setTimeout(initializeMaxisSolver, 100); // Small delay to ensure DOM is ready
});
