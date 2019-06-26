class ItemEditor extends HTMLElement {
    private readonly confirmDialog: any;
    private readonly dismissDialog: any;
    getInvalidMessage: (name: string) => string | null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.confirmDialog = document.createElement('confirm-dialog');
        this.dismissDialog = document.createElement('dismiss-dialog');
    }

    private get fieldNode(): HTMLElement {
        const field: any = document.createElement('vaadin-text-field');
        field.id = 'field';
        field.label = 'Rename';
        field.value = this.item;
        field.addEventListener('change', () => this.handleRename(field));
        return field;
    }

    private get buttonNode(): HTMLElement {
        const button: any = document.createElement('vaadin-button');
        button.ariaLabel = 'Delete item';
        button.theme = 'icon';
        button.innerHTML = '<iron-icon icon="vaadin:minus"></iron-icon>';
        button.addEventListener('click', () => {
            this.confirmDialog.render();
            this.confirmDialog.addEventListener('confirm', () => {
                this.remove();
                this.dispatchEvent(new Event('delete'));
            });
        });
        return button;
    }

    private get item(): string {
        return this.getAttribute('item')!;
    }

    private set item(value: string) {
        this.setAttribute('item', value);
    }

    connectedCallback() {
        this.setUpConfirmDialog();
        const div = document.createElement('div');
        div.appendChild(this.confirmDialog);
        div.appendChild(this.dismissDialog);
        div.appendChild(this.fieldNode);
        div.appendChild(this.buttonNode);
        this.shadowRoot!.appendChild(div);
    }

    private setUpConfirmDialog(): HTMLElement {
        let label = 'Edit item';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label')!;
        this.confirmDialog.ariaLabel = label;
        this.confirmDialog.title = this.getAttribute('dialog-title');
        let cancel = 'Cancel';
        if (this.hasAttribute('dialog-cancel')) cancel = this.getAttribute('dialog-cancel')!;
        this.confirmDialog.cancel = cancel;
        let confirm = 'Confirm';
        if (this.hasAttribute('dialog-confirm')) {
            confirm = this.getAttribute('dialog-confirm')!;
        }
        this.confirmDialog.confirm = confirm;
        this.confirmDialog.textContent = this.getAttribute('dialog-body');
        return this.confirmDialog;
    }

    private handleRename(field: HTMLInputElement): void {
        const html = this.getInvalidMessage(field.value);
        if (html !== null) {
            field.value = this.item;
            const span = document.createElement('span');
            span.innerHTML = html;
            this.dismissDialog.render(span);
        } else {
            const detail = {oldName: this.item, newName: field.value};
            this.dispatchEvent(new CustomEvent('set', {detail}));
            this.item = field.value;
        }
    }
}

customElements.define('item-editor', ItemEditor);