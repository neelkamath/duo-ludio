class TabIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <img 
                alt="${this.getAttribute('alt')}" 
                src="${this.getAttribute('src')}"
                style="height: 24px; width: 24px;"
            >
        `;
        return template.content;
    }
}

customElements.define('tab-icon', TabIcon);