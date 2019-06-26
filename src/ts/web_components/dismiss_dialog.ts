class DismissDialog extends HTMLElement {
    private readonly dialog: any;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.dialog = document.createElement('vaadin-dialog');
    }

    connectedCallback() {
        if (this.hasAttribute('aria-label')) {
            this.dialog.ariaLabel = this.getAttribute('aria-label');
        }
        this.shadowRoot!.appendChild(this.dialog);
    }

    render(child: HTMLElement): void {
        this.dialog.renderer = (root) => root.appendChild(child);
        this.dialog.opened = true;
    }
}

customElements.define('dismiss-dialog', DismissDialog);