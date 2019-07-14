// @ts-ignore: Missing module declaration
import {ItemElement} from '@vaadin/vaadin-item/src/vaadin-item';

/**
 * This web component has the HTML name `titled-item`. It contains a title, and a body. Place the item's HTML in between
 * this element's HTML tags.
 *
 * Example: `<titled-item title="Effects"><ul><li>Focusing</li></ul></titled-item>`
 * @attribute `title` (required) Title (e.g., `Effects`)
 */
export default class TitledItemElement extends HTMLElement {
    private readonly titleElement = document.createElement('strong');
    private readonly body: HTMLDivElement = document.createElement('div');
    private readonly item: ItemElement = document.createElement('vaadin-item');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const titleDiv = document.createElement('div');
        titleDiv.append(this.titleElement);
        this.item.append(titleDiv, this.body);
    }

    static get observedAttributes() {
        return ['title'];
    }

    get title(): string {
        return this.getAttribute('title')!;
    }

    set title(value: string) {
        this.setAttribute('title', value);
    }

    // @ts-ignore: Variable declared but never read
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'title') this.updateTitle();
    }

    connectedCallback() {
        if (!this.isConnected) return;
        if (!this.body.hasChildNodes()) this.body.append(...this.childNodes);
        this.updateTitle();
        this.shadowRoot!.append(this.item);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
    }

    private updateTitle(): void {
        this.titleElement.textContent = this.title;
    }
}

customElements.define('titled-item', TitledItemElement);