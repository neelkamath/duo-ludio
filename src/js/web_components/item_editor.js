class ItemEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
        this.delete = this.shadowRoot.querySelector('#delete');
        this._handleDelete();
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-dialog id="dialog" no-close-on-esc no-close-on-outside-click></vaadin-dialog>
            <vaadin-item>
                <vaadin-button aria-label="Delete item" id="delete" theme="icon">
                    <iron-icon icon="vaadin:minus"></iron-icon>
                </vaadin-button>
                <span>${this.getAttribute('item')}</span>
            </vaadin-item>
        `;
        return template.content;
    }

    get _renderer() {
        return `
            <confirm-dialog 
                id="confirm-dialog"
                title="${this.getAttribute('dialog-title')}" 
                cancel="${this._cancelText}" 
                confirm="${this._confirmText}" 
                body="${this.getAttribute('dialog-body')}"
            ></confirm-dialog>
        `;
    }

    get _cancelText() {
        let cancelText = 'Cancel';
        if (this.hasAttribute('dialog-cancel')) {
            cancelText = this.getAttribute('dialog-cancel');
        }
        return cancelText;
    }

    get _confirmText() {
        let confirmText = 'Confirm';
        if (this.hasAttribute('dialog-confirm')) {
            confirmText = this.getAttribute('dialog-confirm');
        }
        return confirmText;
    }

    _handleDelete() {
        this.delete.addEventListener('click', () => {
            let dialog = this.shadowRoot.querySelector('#dialog');
            dialog.renderer = (root) => root.innerHTML = this._renderer;
            dialog.opened = true;
            let confirmDialog = document.querySelector('#confirm-dialog');
            this.cancel = confirmDialog.cancel;
            this.confirm = confirmDialog.confirm;
            this.cancel.addEventListener('click', () => dialog.opened = false);
            this.confirm.addEventListener('click', () => dialog.opened = false);
        });
    }
}

customElements.define('item-editor', ItemEditor);