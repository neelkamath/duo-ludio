class ConfirmDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-dialog no-close-on-esc no-close-on-outside-click id="dialog" ${this._ariaLabel}"></vaadin-dialog>
        `;
        return template.content;
    }

    get _ariaLabel() {
        let label = 'Confirm';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label');
        return `aria-label=${label}`;
    }

    render() {
        let dialog = this.shadowRoot.querySelector('#dialog');
        dialog.renderer = (root) => root.innerHTML = `
            <span id="content">
                <div><strong>${this.getAttribute('title')}</strong></div>
                <br>
                <div>${this.getAttribute('body')}</div>
                <dialog-button id="confirm">${this._confirmText}</dialog-button>
                <dialog-button id="cancel">${this._cancelText}</dialog-button>
            </span>
        `;
        dialog.opened = true;
        let content = document.querySelector('#content');
        content.querySelector('#cancel').addEventListener('click', () => dialog.opened = false);
        this.confirm = content.querySelector('#confirm');
        this.confirm.addEventListener('click', () => dialog.opened = false);
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