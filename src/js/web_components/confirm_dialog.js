class ConfirmDialog extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        let templateContent = document.querySelector('#confirm-dialog-template').content;
        shadow.appendChild(templateContent.cloneNode(true));

        shadow.querySelector('#title').textContent = this.getAttribute('title');
        shadow.querySelector('#body').textContent = this.getAttribute('body');
        let cancelText = 'Cancel';
        if (this.hasAttribute('cancel')) cancelText = this.getAttribute('cancel');
        shadow.querySelector('#cancel').textContent = cancelText;
        let confirmText = 'Confirm';
        if (this.hasAttribute('confirm')) confirmText = this.getAttribute('confirm');
        shadow.querySelector('#confirm').textContent = confirmText;
    }
}

customElements.define('confirm-dialog', ConfirmDialog);