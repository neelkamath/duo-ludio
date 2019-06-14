class OKDialog extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        let template = document.querySelector('#ok-dialog-template').content;
        shadow.appendChild(template.cloneNode(true));
        shadow.querySelector('#message').textContent = this.getAttribute('message');
    }
}

customElements.define('ok-dialog', OKDialog);