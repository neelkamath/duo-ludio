class DismissDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._dialog = document.createElement('vaadin-dialog');
    }

    connectedCallback() {
        if (this.hasAttribute('aria-label')) {
            this._dialog.ariaLabel = this.getAttribute('aria-label');
        }
        this.shadowRoot.appendChild(this._dialog);
    }

    render(child) {
        this._dialog.renderer = (root) => root.appendChild(child);
        setTimeout(() => this._dialog.opened = true, 100);
    }
}

customElements.define('dismiss-dialog', DismissDialog);