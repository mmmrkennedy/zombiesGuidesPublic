console.log("Loaded Scripts")

/*
=======================================
LIGHT AND DARK MODE FUNCTIONALITIES
=======================================
*/

function toggleLightMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
}

function changeThemeColour(){
    const savedColorMode = localStorage.getItem('colourMode');
    if(savedColorMode === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    changeThemeColour();
});

/*
=======================================
PRELOAD IMAGES AND VIDEOS
=======================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Preload Images if enabled in localStorage
    if (localStorage.getItem('preload') === 'true') {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const anchors = Array.from(document.querySelectorAll('a[href]'))
            .filter(anchor => imageExtensions.some(ext => anchor.href.endsWith(ext)));

        anchors.forEach(anchor => {
            new Image().src = anchor.href;
        });
    }
});


/*
=======================================
STORAGE EVENT LISTENERS
=======================================
*/

window.addEventListener('storage', function(event) {
    switch(event.key) {
        case 'preload':
            if(localStorage.getItem("preload") === 'true') {
                window.location.reload();
            }
            break;
        case 'colourMode':
            changeThemeColour();
            break;
        case 'substeps':
            substeps((localStorage.getItem("substeps") === 'true'));
            if(localStorage.getItem("substeps") === 'true') {
                window.location.href = window.location.href.split("#")[0];
            }
            break;
        case 'close_setting_auto':
            break;
        case 'fontSelector':
            window.location.reload()
            break;
        default:
            console.log("Unknown Storage Event", event);
    }
});


/*
=======================================
USING DEFAULT FONTS
=======================================
*/
document.addEventListener('DOMContentLoaded', function() {
    let path = window.location.pathname;
    let page = path.split("/").pop();

    if (page !== "index.html") {
        let savedFont = localStorage.getItem('fontSelector');

        // First Load protection, so the user has a populated font selection box the first time they load the page
        if (savedFont == null) {
            savedFont = "Verdana";
        }

        const smoothScroll = document.querySelector('.smooth-scroll');
        let fontSelector = document.getElementById('fontSelector');
        if (fontSelector == null){
            return
        }

        fontSelector.value = savedFont;

        if (savedFont === 'OpenDyslexic') {
            smoothScroll.classList.remove('verdana');
            smoothScroll.classList.add('open-dyslexic');
        } else if (savedFont === 'Verdana') {
            smoothScroll.classList.remove('open-dyslexic');
            smoothScroll.classList.add('verdana');
        } else if (savedFont === 'Arial') {
            smoothScroll.classList.remove('open-dyslexic');
            smoothScroll.classList.remove('verdana');
        }
    }
});

/*
=======================================
NAVIGATION UTILITIES
=======================================
*/

function navigateToIndex() {
    window.location.href = "/zombiesGuidesPublic/index.html";
}

function navigateToSettings() {
    window.open("/zombiesGuidesPublic/settings/settings.html", "_blank");
}

/*
=======================================
SCROLL FUNCTIONS
=======================================
*/

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
    window.history.pushState(null, null, '#');
}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                const elementId = href.substring(1);
                scrollToElement(elementId, 105);
            }
        }
    });
});

function scrollToElement(elementId, offset) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const targetY = elementPosition + window.scrollY - offset;
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    }
}

/*
=======================================
FONT SELECTOR FUNCTIONALITIES
=======================================
*/

document.addEventListener("DOMContentLoaded", function() {
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector == null){
        return
    }

    const smoothScroll = document.querySelector('.smooth-scroll');
    let path = window.location.pathname;
    let page = path.split("/").pop();

    if (page !== "index.html") {
        fontSelector.addEventListener('change', () => {
            const selectedFont = fontSelector.value;
            if (selectedFont === 'OpenDyslexic') {
                smoothScroll.classList.remove('verdana');
                smoothScroll.classList.add('open-dyslexic');
            } else if (selectedFont === 'Verdana') {
                smoothScroll.classList.remove('open-dyslexic');
                smoothScroll.classList.add('verdana');
            } else if (selectedFont === 'Arial') {
                smoothScroll.classList.remove('open-dyslexic');
                smoothScroll.classList.remove('verdana');
            }
        });
    }
});

/*
=======================================
MOBILE DETECTION AND HANDLING
=======================================
*/

function hasTouchScreen() {
    let hasTouchScreen;

    if ("maxTouchPoints" in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
        let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
        if (mQ && mQ.media === "(pointer:coarse)") {
            hasTouchScreen = !!mQ.matches;
        } else if ('orientation' in window) {
            hasTouchScreen = true; // deprecated, but good fallback
        } else {
            // Only as a last resort, fall back to user agent sniffing
            let UA = navigator.userAgent;
            hasTouchScreen = (
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
            );
        }
    }
    return hasTouchScreen;
}

document.addEventListener("DOMContentLoaded", function() {
    let check = hasTouchScreen();

    if (check) {
        document.getElementById('mobileContent').style.display = 'block';
        document.getElementById('nonMobileContent').style.display = 'none';
    } else {
        document.getElementById('mobileContent').style.display = 'none';
        document.getElementById('nonMobileContent').style.display = 'block';
    }
});

/*
=======================================
HISTORY MANAGEMENT FOR ANCHOR LINKS
=======================================
*/

document.addEventListener('click', function(event) {
    let target = event.target;
    if (target.tagName.toLowerCase() === 'a' && target.hash) {
        window.history.pushState({hash: target.hash}, '', target.hash);
    }
});

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.hash) {
        window.location.hash = event.state.hash;
    }
});


/*
=======================================
SUBSTEP FUNCTIONALITIES
=======================================
 */
function substeps(check) {
    let displayStyle;
    if (check) {
        displayStyle = 'block';
    } else {
        displayStyle = 'none';
    }

    let i = 1;
    while(true) {
        try{
            document.getElementById('substeps' + i).style.display = displayStyle;
        } catch (e) {
            break;
        }
        i++;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    substeps((localStorage.getItem('substeps') === 'true'));
});

/*
=======================================
INCOMPLETE PATH FOR A TAGS
=======================================
 */
window.addEventListener("DOMContentLoaded", function () {
    //document.addEventListener("DOMContentLoaded", function () {
    const allATags = document.querySelectorAll('a');

    allATags.forEach(function (tag) {
        const hrefValue = tag.getAttribute('href');

        // Skip if hrefValue starts with # (anchor link) or http/https (absolute URL).
        if (hrefValue.startsWith('#') || hrefValue.startsWith('http://') || hrefValue.startsWith('https://')) {
            return;
        }

        if (hrefValue.endsWith("/")) {
            tag.classList.add('incomplete-path');
            return;

        }

        if (!(hrefValue.includes(".webp") || hrefValue.includes(".html") || hrefValue.includes(".webm"))) {
            tag.classList.add('wrong_file_type');
            return;

        }

        fetch(hrefValue, { method: 'HEAD' })
            .then(response => {
                if (!response.ok && !response.url.endsWith("/")) {
                    tag.classList.add('file-doesnt-exist');
                }
            })
            .catch(() => {
                tag.classList.add('file-doesnt-exist');
            });
    });
});

/*
=======================================
ADD LINK TO PAGE CLASS TO A TAGS
=======================================
 */
document.addEventListener("DOMContentLoaded", function() {
    // Select all <a> tags in the document that are not inside .content-container-top
    const links = document.querySelectorAll("a:not(.content-container-top a)");

    // Loop through each <a> tag
    links.forEach(function(link) {
        let link_href = link.getAttribute("href");

        if (link_href.includes("#")) {
            link.classList.add("link-to-page");
        }

        if (link_href.includes("youtu.be") || link_href.includes("youtube") || link_href.includes(".com") || link_href.includes("http")) {
            link.classList.add("youtube-link");
        }
    });
});
