import * as utility from '../utility';

class ConfirmDialog extends HTMLElement {
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
            <vaadin-dialog no-close-on-esc no-close-on-outside-click id="dialog" ${this._ariaLabel}></vaadin-dialog>
        `;
        return template.content;
    }

    get _ariaLabel() {
        let label = 'Confirm';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label');
        return `aria-label=${label}`;
    }

    get _cancelHTML() {
        let cancelText = 'Cancel';
        if (this.hasAttribute('cancel')) cancelText = this.getAttribute('cancel');
        return cancelText;
    }

    get _confirmHTML() {
        let confirmText = 'Confirm';
        if (this.hasAttribute('confirm')) confirmText = this.getAttribute('confirm');
        return confirmText;
    }

    get _dialogContent() {
        return `
            <span id="content">
                <div><strong>${this.getAttribute('title')}</strong></div>
                <br>
                <div>${this.innerHTML}</div>
                <dialog-button id="confirm">${this._confirmHTML}</dialog-button>
                <dialog-button id="cancel">${this._cancelHTML}</dialog-button>
            </span>
        `;
    }

    render() {
        let dialog = this.shadowRoot.querySelector('#dialog');
        dialog.renderer = (root) => root.innerHTML = this._dialogContent;
        dialog.opened = true;
        this._addEventListeners(dialog);
    }

    _addEventListeners(dialog) {
        let content = document.querySelector('#content');
        content.querySelector('#cancel').addEventListener('click', () => {
            utility.runAfterButtonAnimation(() => dialog.opened = false);
        });
        this.confirm = content.querySelector('#confirm');
        this.confirm.addEventListener('click', () => {
            utility.runAfterButtonAnimation(() => dialog.opened = false);
        });
    }
}

customElements.define('confirm-dialog', ConfirmDialog);