class ConfirmDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
        this.cancel = this.shadowRoot.querySelector('#cancel');
        this.confirm = this.shadowRoot.querySelector('#confirm');
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <div><strong>${this.getAttribute('title')}</strong></div>
            <br>
            <div>${this.getAttribute('body')}</div>
            <dialog-button id="confirm">${this._confirmText}</dialog-button>
            <dialog-button id="cancel">${this._cancelText}</dialog-button>
        `;
        return template.content;
    }

    get _cancelText() {
        let cancelText = 'Cancel';
        if (this.hasAttribute('cancel')) cancelText = this.getAttribute('cancel');
        return cancelText;
    }

    get _confirmText() {
        let confirmText = 'Confirm';
        if (this.hasAttribute('confirm')) confirmText = this.getAttribute('confirm');
        return confirmText;
    }
}

customElements.define('confirm-dialog', ConfirmDialog);