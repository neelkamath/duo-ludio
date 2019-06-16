class ItemEditor extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.appendChild(ItemEditor._getTemplateContent().cloneNode(true));

        this.delete = this.shadowRoot.querySelector('#delete');

        this.shadowRoot.querySelector('#item').textContent = this.getAttribute('item');
        this._handleDelete();

    }

    static _getTemplateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-dialog id="dialog" no-close-on-esc no-close-on-outside-click></vaadin-dialog>
            <vaadin-item>
                <vaadin-button aria-label="Delete item" id="delete" theme="icon">
                    <iron-icon icon="vaadin:minus"></iron-icon>
                </vaadin-button>
                <span id="item"></span>
            </vaadin-item>
        `;
        return template.content;
    }

    _handleDelete() {
        this.delete.addEventListener('click', () => {
            let dialog = this.shadowRoot.querySelector('#dialog');
            let cancelText = 'Cancel';
            if (this.hasAttribute('dialog-cancel')) {
                cancelText = this.getAttribute('dialog-cancel');
            }
            let confirmText = 'Confirm';
            if (this.hasAttribute('dialog-confirm')) {
                confirmText = this.getAttribute('dialog-confirm');
            }
            dialog.renderer = (root) => root.innerHTML = `
                <confirm-dialog 
                    id="confirm-dialog"
                    title="${this.getAttribute('dialog-title')}" 
                    cancel="${cancelText}" 
                    confirm="${confirmText}" 
                    body="${this.getAttribute('dialog-body')}"
                ></confirm-dialog>
            `;
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