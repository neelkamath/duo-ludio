/**
 * This web component has the HTML name `tab-icon`.
 *
 * Example: `<tab-icon alt="Alpha" src="https://bit.ly/2wTc8tv"></tab-icon>`
 *
 * @attribute `alt` (required) Alternative text to display if the icon can't be seen (e.g., `Alpha`)
 * @attribute `src` (required) Icon's source (e.g., `https://bit.ly/2wTc8tv`)
 */
export class TabIconElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const img = document.createElement('img');
        img.alt = this.getAttribute('alt')!;
        img.src = this.getAttribute('src')!;
        img.style.height = img.style.width = '24px';
        this.shadowRoot!.appendChild(img);
    }
}

customElements.define('tab-icon', TabIconElement);