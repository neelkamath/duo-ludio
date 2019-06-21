import * as utility from '../utility';

class TabIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        let template = document.createElement('template');
        template.innerHTML = `
            <img 
                alt="${utility.getAttribute(this, 'alt')}" 
                src="${utility.getAttribute(this, 'src')}"
                style="height: 24px; width: 24px;"
            >
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('tab-icon', TabIcon);