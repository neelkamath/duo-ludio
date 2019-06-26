class ConfirmDialog extends HTMLElement {
    private readonly dialog: any;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.dialog = document.createElement('vaadin-dialog');
    }

    private get titleNode(): HTMLElement {
        const div = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = this.getAttribute('title');
        div.appendChild(strong);
        return div;
    }

    private get confirmNode(): HTMLElement {
        const button = document.createElement('dialog-button');
        let content = 'Confirm';
        if (this.hasAttribute('confirm')) content = this.getAttribute('confirm')!;
        button.textContent = content;
        button.addEventListener('click', () => {
            this.dialog.opened = false;
            this.dispatchEvent(new Event('confirm'));
        });
        return button;
    }

    private get cancelNode(): HTMLElement {
        const button = document.createElement('dialog-button');
        let cancel = 'Cancel';
        if (this.hasAttribute('cancel')) cancel = this.getAttribute('cancel')!;
        button.textContent = cancel;
        button.addEventListener('click', () => this.dialog.opened = false);
        return button;
    }

    connectedCallback() {
        this.dialog.noCloseOnEsc = true;
        this.dialog.noCloseOnOutsideClick = true;
        let label = 'Confirm';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label')!;
        this.dialog.ariaLabel = label;
        this.shadowRoot!.appendChild(this.dialog);
    }

    render(): void {
        this.dialog.renderer = (root) => {
            root.appendChild(this.titleNode);
            root.appendChild(document.createElement('br'));
            const div = document.createElement('div');
            div.innerHTML = this.innerHTML;
            root.appendChild(div);
            root.appendChild(this.confirmNode);
            root.appendChild(this.cancelNode);
        };
        this.dialog.opened = true;
    }
}

customElements.define('confirm-dialog', ConfirmDialog);