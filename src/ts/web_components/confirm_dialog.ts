class ConfirmDialog extends HTMLElement {
    _dialog: any;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._dialog = document.createElement('vaadin-dialog');
    }

    get _titleNode() {
        let div = document.createElement('div');
        let strong = document.createElement('strong');
        strong.textContent = this.getAttribute('title');
        div.appendChild(strong);
        return div;
    }

    get _confirmNode() {
        let button = document.createElement('dialog-button');
        let content: any = 'Confirm';
        if (this.hasAttribute('confirm')) content = this.getAttribute('confirm');
        button.textContent = content;
        button.addEventListener('click', () => {
            this._dialog.opened = false;
            this.dispatchEvent(new Event('confirm'));
        });
        return button;
    }

    get _cancelNode() {
        let button = document.createElement('dialog-button');
        let cancel: any = 'Cancel';
        if (this.hasAttribute('cancel')) cancel = this.getAttribute('cancel');
        button.textContent = cancel;
        button.addEventListener('click', () => this._dialog.opened = false);
        return button;
    }

    connectedCallback() {
        this._dialog.noCloseOnEsc = true;
        this._dialog.noCloseOnOutsideClick = true;
        let label: any = 'Confirm';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label');
        this._dialog.ariaLabel = label;
        this.shadowRoot!.appendChild(this._dialog);
    }

    render() {
        this._dialog.renderer = (root) => {
            root.appendChild(this._titleNode);
            root.appendChild(document.createElement('br'));
            let div = document.createElement('div');
            div.innerHTML = this.innerHTML;
            root.appendChild(div);
            root.appendChild(this._confirmNode);
            root.appendChild(this._cancelNode);
        };
        this._dialog.opened = true;
    }
}

customElements.define('confirm-dialog', ConfirmDialog);