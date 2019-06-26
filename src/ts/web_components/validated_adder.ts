class ValidatedAdder extends HTMLElement {
    private readonly dialog: any;
    getInvalidMessage: (name: string) => string | null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.dialog = document.createElement('dismiss-dialog');
    }

    private get itemNode(): HTMLElement {
        const item = document.createElement('add-item');
        item.addEventListener('add', ({detail}: CustomEvent) => {
            const name = detail.trim();
            const message = this.getInvalidMessage(name);
            if (message === null) {
                this.dispatchEvent(new CustomEvent('add', {detail: name}));
                return;
            }
            const span = document.createElement('span');
            span.innerHTML = message;
            this.dialog.render(span);
        });
        return item;
    }

    connectedCallback() {
        if (this.hasAttribute('aria-label')) {
            this.dialog.ariaLabel = this.getAttribute('aria-label');
        }
        this.shadowRoot!.appendChild(this.dialog);
        this.shadowRoot!.appendChild(this.itemNode);
    }
}

customElements.define('validated-adder', ValidatedAdder);