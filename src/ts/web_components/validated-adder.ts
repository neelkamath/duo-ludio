class ValidatedAdder extends HTMLElement {
    _dialog: any;
    getInvalidMessage: (name: string) => string | null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._dialog = document.createElement('dismiss-dialog');
    }

    get _itemNode() {
        let item = document.createElement('add-item');
        item.addEventListener('add', ({detail}: CustomEvent) => {
            let name = detail.trim();
            let message = this.getInvalidMessage(name);
            if (message === null) {
                this.dispatchEvent(new CustomEvent('add', {detail: name}));
                return;
            }
            let span = document.createElement('span');
            span.innerHTML = message;
            this._dialog.render(span);
        });
        return item;
    }

    connectedCallback() {
        if (this.hasAttribute('aria-label')) {
            this._dialog.ariaLabel = this.getAttribute('aria-label');
        }
        this.shadowRoot!.appendChild(this._dialog);
        this.shadowRoot!.appendChild(this._itemNode);
    }
}

customElements.define('validated-adder', ValidatedAdder);