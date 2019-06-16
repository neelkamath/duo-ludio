class CategoryAdder extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let templateContent = document.querySelector('#add-category-template').content;
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
    }
}

customElements.define('add-category', CategoryAdder);