class CategoryAdder extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        let templateContent = document.querySelector('#add-category-template').content;
        shadow.appendChild(templateContent.cloneNode(true));
    }
}

customElements.define('add-category', CategoryAdder);