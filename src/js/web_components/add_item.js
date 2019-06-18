class ItemAdder extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.shadowRoot.appendChild(ItemAdder._templateContent.cloneNode(true));
        this.field = this.shadowRoot.querySelector('#name');
        this.button = this.shadowRoot.querySelector('#add');
    }

    static get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-text-field id="name" label="Category name" placeholder="Mindless HW"></vaadin-text-field>
            <vaadin-button aria-label="Add category" id="add" theme="icon">
                <iron-icon icon="vaadin:plus"></iron-icon>
            </vaadin-button>
        `;
        return template.content;
    }
}

customElements.define('add-item', ItemAdder);