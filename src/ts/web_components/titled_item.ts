/**
 * This web component has the HTML name `titled-item`. It contains a title, and a body. Place the item's HTML in between
 * this element's HTML tags.
 *
 * Example: `<titled-item title="Effects"><ul><li>Focusing</li></ul></titled-item>`
 *
 * @attribute `title` (required) Title (e.g., `Effects`)
 */
export class TitledItemElement extends HTMLElement {
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

customElements.define('titled-item', TitledItemElement);