class ConfirmDialog extends HTMLElement {
    constructor() {
        super();

        let templateContent = document.querySelector('#confirm-dialog').content;

        const shadow = this.attachShadow({mode: 'open'});

        shadow.appendChild(templateContent.cloneNode(true));

        shadow.querySelector('#title').textContent = this.getAttribute('title');
        shadow.querySelector('#body').textContent = this.getAttribute('body');
        shadow.querySelector('#cancel').textContent = this.getAttribute('cancel');
        shadow.querySelector('#confirm').textContent = this.getAttribute('confirm');
    }
}

customElements.define('confirm-dialog', ConfirmDialog);