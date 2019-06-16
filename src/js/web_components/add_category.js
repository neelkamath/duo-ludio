class ItemAdder extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-text-field id="name" label="Category name" placeholder="Mindless HW"></vaadin-text-field>
            <vaadin-button aria-label="Add category" id="add" theme="icon">
                <iron-icon icon="vaadin:plus"></iron-icon>
            </vaadin-button>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.field = this.shadowRoot.querySelector('#name');
        this.button = this.shadowRoot.querySelector('#add');
    }
}

customElements.define('add-item', ItemAdder);