import * as utility from '../utility';

class TitledItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-item>
                <div><strong>${utility.getAttribute(this, 'title')}</strong></div>
                <div id="body">${this.innerHTML}</div>
            </vaadin-item>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('titled-item', TitledItem);