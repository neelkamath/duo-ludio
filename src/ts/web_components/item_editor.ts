class ItemEditor extends HTMLElement {
    _confirmDialog: any;
    _dismissDialog: any;
    getInvalidMessage: (name: string) => string | null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._confirmDialog = document.createElement('confirm-dialog');
        this._dismissDialog = document.createElement('dismiss-dialog');
    }

    get _fieldNode() {
        let field: any = document.createElement('vaadin-text-field');
        field.id = 'field';
        field.label = 'Rename';
        field.value = this._item;
        field.addEventListener('change', () => this._handleRename(field));
        return field;
    }

    get _buttonNode() {
        let button: any = document.createElement('vaadin-button');
        button.ariaLabel = 'Delete item';
        button.theme = 'icon';
        button.innerHTML = '<iron-icon icon="vaadin:minus"></iron-icon>';
        button.addEventListener('click', () => {
            this._confirmDialog.render();
            this._confirmDialog.addEventListener('confirm', () => {
                this.remove();
                this.dispatchEvent(new Event('delete'));
            });
        });
        return button;
    }

    get _item() {
        return this.getAttribute('item')!;
    }

    set _item(value: string) {
        this.setAttribute('item', value);
    }

    _setUpConfirmDialog() {
        let label: any = 'Edit item';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label');
        this._confirmDialog.ariaLabel = label;
        this._confirmDialog.title = this.getAttribute('dialog-title');
        let cancel: any = 'Cancel';
        if (this.hasAttribute('dialog-cancel')) cancel = this.getAttribute('dialog-cancel');
        this._confirmDialog.cancel = cancel;
        let confirm: any = 'Confirm';
        if (this.hasAttribute('dialog-confirm')) {
            confirm = this.getAttribute('dialog-confirm');
        }
        this._confirmDialog.confirm = confirm;
        this._confirmDialog.textContent = this.getAttribute('dialog-body');
        return this._confirmDialog;
    }

    _handleRename(field) {
        let html = this.getInvalidMessage(field.value);
        if (html !== null) {
            field.value = this._item;
            let span = document.createElement('span');
            span.innerHTML = html;
            this._dismissDialog.render(span);
        } else {
            let detail = {oldName: this._item, newName: field.value};
            this.dispatchEvent(new CustomEvent('set', {detail}));
            this._item = field.value;
        }
    }

    connectedCallback() {
        this._setUpConfirmDialog();
        let div = document.createElement('div');
        div.appendChild(this._confirmDialog);
        div.appendChild(this._dismissDialog);
        div.appendChild(this._fieldNode);
        div.appendChild(this._buttonNode);
        this.shadowRoot!.appendChild(div);
    }
}

customElements.define('item-editor', ItemEditor);