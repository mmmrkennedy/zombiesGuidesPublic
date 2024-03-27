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

document.addEventListener('DOMContentLoaded', function() {
    // Preload Images
    if(localStorage.getItem('preload') === 'true') {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const anchors = [];

        imageExtensions.forEach(ext => {
            const foundAnchors = document.querySelectorAll(`a[href$="${ext}"]`);
            anchors.push(...foundAnchors);
        });

        anchors.forEach(anchor => {
            const image = new Image();
            image.src = anchor.href;
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

    if(page !== "index.html") {
        let savedFont = localStorage.getItem('fontSelector');

        // First Load protection, so the user has a populated font selection box the first time they load the page
        if(savedFont == null) {
            savedFont = "Verdana";
        }

        const smoothScroll = document.querySelector('.smooth-scroll');
        let fontSelector = document.getElementById('fontSelector');
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
    window.location.href = "/zombiesGuides/index.html";
}

function navigateToSettings() {
    window.open("/zombiesGuides/settings/settings.html", "_blank");
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
                scrollToElement(elementId, 100);
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

const fontSelector = document.getElementById('fontSelector');
const smoothScroll = document.querySelector('.smooth-scroll');
let path = window.location.pathname;
let page = path.split("/").pop();

if(page !== "index.html") {
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

function isMobileDevice() {
    let check = false;

    function checkDevice(userAgent) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0,4))) {
            check = true;
        }
    }

    checkDevice(navigator.userAgent || navigator.vendor || window.opera);

    return check;
}


document.addEventListener("DOMContentLoaded", function() {
    let check1 = hasTouchScreen();
    let check2 = isMobileDevice()
    if (check1 || check2) {
        document.getElementById('mobileContent').style.display = 'block';
        document.getElementById('nonMobileContent').style.display = 'none';
    } else {
        document.getElementById('mobileContent').style.display = 'none';
        document.getElementById('nonMobileContent').style.display = 'block';
    }

    setTimeout(function(){
        console.log("Check Called")
        if (check1 || check2) {
            document.getElementById('mobileContent').style.display = 'block';
            document.getElementById('nonMobileContent').style.display = 'none';
        } else {
            document.getElementById('mobileContent').style.display = 'none';
            document.getElementById('nonMobileContent').style.display = 'block';
        }
    }, 2000);
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
document.addEventListener("DOMContentLoaded", function () {
    var allATags = document.querySelectorAll('a');

    allATags.forEach(function (tag) {
        var hrefValue = tag.getAttribute('href');
        console.log(hrefValue)

        // Skip if hrefValue starts with # (anchor link) or http/https (absolute URL).
        if (hrefValue.startsWith('#') || hrefValue.startsWith('http://') || hrefValue.startsWith('https://')) {
            return;
        }

        // Check if the hrefValue doesn't have a file extension.
        if (!/\.(webp|jpg|jpeg|png|html|mp4|gif)$/i.test(hrefValue)) {
            tag.classList.add('incomplete-path');

        } else if (!(hrefValue.includes(".webp") || hrefValue.includes(".html"))) {
            tag.classList.add('file-dne');
        }
        

    });
});