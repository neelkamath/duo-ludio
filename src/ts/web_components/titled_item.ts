class TitledItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        let item = document.createElement('vaadin-item');
        let titleDiv = document.createElement('div');
        let strong = document.createElement('strong');
        strong.textContent = this.getAttribute('title');
        titleDiv.appendChild(strong);
        item.appendChild(titleDiv);
        let bodyDiv = document.createElement('div');
        bodyDiv.innerHTML = this.innerHTML;
        item.appendChild(bodyDiv);
        this.shadowRoot!.appendChild(item);
    }
}

customElements.define('titled-item', TitledItem);