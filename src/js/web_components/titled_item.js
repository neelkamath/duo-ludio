class TitledItem extends HTMLElement {
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
            <vaadin-item>
                <div><strong>${this.getAttribute('title')}</strong></div>
                <div id="body">${this.innerHTML}</div>
            </vaadin-item>
        `;
        return template.content;
    }
}

customElements.define('titled-item', TitledItem);