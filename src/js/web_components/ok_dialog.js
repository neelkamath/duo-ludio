class OKDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let template = document.querySelector('#ok-dialog-template').content;
        this.shadowRoot.appendChild(template.cloneNode(true));
        this.shadowRoot.querySelector('#message').textContent = this.getAttribute('message');
    }
}

customElements.define('ok-dialog', OKDialog);