class ItemAdder extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const field: any = document.createElement('vaadin-text-field');
        field.label = 'Item name';
        field.placeholder = 'Mindless HW';
        this.shadowRoot!.appendChild(field);
        this.shadowRoot!.appendChild(this.getButton(field));
    }

    private getButton(field): HTMLElement {
        const button: any = document.createElement('vaadin-button');
        button.ariaLabel = 'Add item';
        button.theme = 'icon';
        button.innerHTML = '<iron-icon icon="vaadin:plus"></iron-icon>';
        button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add', {detail: field.value}));
            field.value = '';
        });
        return button;
    }
}

customElements.define('add-item', ItemAdder);