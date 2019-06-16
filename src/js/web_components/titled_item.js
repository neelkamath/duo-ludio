class TitledItem extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let content = document.querySelector('#titled-item-template').content;
        this.shadowRoot.appendChild(content.cloneNode(true));

        this.shadowRoot.querySelector('#title').textContent = this.getAttribute('title');
        this.shadowRoot.querySelector('#body').innerHTML = this.getAttribute('body');
    }
}

customElements.define('titled-item', TitledItem);