/**
 * This web component has the HTML name `titled-item`. It contains a title, and a body. Place the item's HTML in between
 * this element's HTML tags.
 *
 * Example: `<titled-item title="Effects"><ul><li>Focusing</li></ul></titled-item>`
 * @attribute `title` (required) Title (e.g., `Effects`)
 */
export default class TitledItemElement extends HTMLElement {
    private connectedOnce = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        const item = document.createElement('vaadin-item');
        const titleDiv = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = this.getAttribute('title');
        titleDiv.append(strong);
        const bodyDiv = document.createElement('div');
        bodyDiv.append(...this.childNodes);
        item.append(titleDiv, bodyDiv);
        this.shadowRoot!.append(item);
    }
}

customElements.define('titled-item', TitledItemElement);