class OKDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
        this.button = this.shadowRoot.querySelector('#ok');
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <div>${this.getAttribute('message')}</div>
            <dialog-button id="ok">OK</dialog-button>
        `;
        return template.content;
    }
}

customElements.define('ok-dialog', OKDialog);