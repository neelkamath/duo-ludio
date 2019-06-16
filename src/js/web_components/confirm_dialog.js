class ConfirmDialog extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let templateContent = document.querySelector('#confirm-dialog-template').content;
        this.shadowRoot.appendChild(templateContent.cloneNode(true));

        this.shadowRoot.querySelector('#title').textContent = this.getAttribute('title');
        this.shadowRoot.querySelector('#body').textContent = this.getAttribute('body');
        let cancelText = 'Cancel';
        if (this.hasAttribute('cancel')) cancelText = this.getAttribute('cancel');
        this.shadowRoot.querySelector('#cancel').textContent = cancelText;
        let confirmText = 'Confirm';
        if (this.hasAttribute('confirm')) confirmText = this.getAttribute('confirm');
        this.shadowRoot.querySelector('#confirm').textContent = confirmText;
    }
}

customElements.define('confirm-dialog', ConfirmDialog);