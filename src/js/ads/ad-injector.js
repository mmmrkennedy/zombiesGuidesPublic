document.addEventListener('DOMContentLoaded', () => {
    const adsEnabled = localStorage.getItem('adsEnabled') !== 'false';

    const sections = document.querySelectorAll('.content-container');

    sections.forEach((section, index) => {
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container';
        adContainer.style.display = adsEnabled ? 'block' : 'none';
        adContainer.innerHTML = `
            <ins class="adsbygoogle"
                 style="display:block; text-align:center;"
                 data-ad-layout="in-article"
                 data-ad-format="fluid"
                 data-ad-client="ca-pub-2164582284838563"
                 data-ad-slot="9671872547"></ins>
        `;

        section.appendChild(adContainer);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
});