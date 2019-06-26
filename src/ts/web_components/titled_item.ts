class TitledItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const item = document.createElement('vaadin-item');
        const titleDiv = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = this.getAttribute('title');
        titleDiv.appendChild(strong);
        item.appendChild(titleDiv);
        const bodyDiv = document.createElement('div');
        bodyDiv.innerHTML = this.innerHTML;
        item.appendChild(bodyDiv);
        this.shadowRoot!.appendChild(item);
    }
}

customElements.define('titled-item', TitledItem);