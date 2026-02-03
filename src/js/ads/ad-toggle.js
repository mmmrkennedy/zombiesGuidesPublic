document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('adToggle');
    toggle.checked = localStorage.getItem('adsEnabled') !== 'false';

    toggle.addEventListener('change', () => {
        localStorage.setItem('adsEnabled', String(toggle.checked));
        const adsEnabled = toggle.checked;

        const adContainers = document.querySelectorAll('.ad-container');

        adContainers.forEach((container, index) => {
            try {
                if (adsEnabled) {
                    container.style.display = '';
                    const ins = container.querySelector('.adsbygoogle');
                    if (ins) {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                    }
                } else {
                    container.style.display = 'none';
                }
            } catch (e) {
                console.error(`Error on container ${index}:`, e);
            }
        });
    });
});