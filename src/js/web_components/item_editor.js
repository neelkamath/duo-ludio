import * as utility from '../utility';

class ItemEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <confirm-dialog 
                id="confirm-dialog"
                aria-label="${utility.getAttribute(this, 'aria-label', 'Edit item')}"
                title="${utility.getAttribute(this, 'dialog-title')}"
                cancel="${utility.getAttribute(this, 'dialog-cancel', 'Cancel')}" 
                confirm="${utility.getAttribute(this, 'dialog-confirm', 'Confirm')}"
            >
                ${utility.getAttribute(this, 'dialog-body')}
            </confirm-dialog>
            <vaadin-item>
                <vaadin-button aria-label="Delete item" id="delete" theme="icon">
                    <iron-icon icon="vaadin:minus"></iron-icon>
                </vaadin-button>
                <dismiss-dialog id="dismiss-dialog"></dismiss-dialog>
                <vaadin-text-field id="field" label="Rename" value="${utility.escapeHTML(this._item)}">
                </vaadin-text-field>
            </vaadin-item>
        `;
        return template.content;
    }

    get _item() {
        return this.getAttribute('item');
    }

    set _item(value) {
        this.setAttribute('item', value);
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
        this.delete = this.shadowRoot.querySelector('#delete');
        this._handleDelete();
        this._handleRename();
    }

    _handleDelete() {
        this.delete.addEventListener('click', () => {
            let dialog = this.shadowRoot.querySelector('#confirm-dialog');
            dialog.render();
            this.confirm = dialog.confirm;
            this.confirm.addEventListener('click', () => dialog.opened = false);
        });
    }

    _handleRename() {
        let field = this.shadowRoot.querySelector('#field');
        field.addEventListener('change', () => {
            let html = this.isInvalid(field.value);
            if (html !== null) {
                field.value = this._item;
                this.renderDismissDialog(html);
            } else {
                this.setItem(this._item, field.value);
                this._item = field.value;
            }
        });
    }

    renderDismissDialog(html) {
        setTimeout(() => this.shadowRoot.querySelector('#dismiss-dialog').render(html), 50);
    }
}

customElements.define('item-editor', ItemEditor);