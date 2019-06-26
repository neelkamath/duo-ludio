class TabIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        let img: HTMLImageElement = document.createElement('img');
        img.alt = this.getAttribute('alt')!;
        img.src = this.getAttribute('src')!;
        img.style.height = img.style.width = '24px';
        this.shadowRoot!.appendChild(img);
    }
}

customElements.define('tab-icon', TabIcon);