/**
 * This web component has the HTML name `titled-item`. It contains a title, and a body. Place the item's HTML in between
 * this element's HTML tags.
 *
 * Example: `<titled-item title="Effects"><ul><li>Focusing</li></ul></titled-item>`
 * @attribute `title` (required) Title (e.g., `Effects`)
 */
export default class TitledItemElement extends HTMLElement {
    private readonly titleElement = document.createElement('strong');
    private body: HTMLDivElement | null = null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
        return ['title'];
    }

    get title(): string {
        return this.getAttribute('title')!;
    }

    set title(value: string) {
        this.setAttribute('title', value);
        this.updateTitle();
    }

    // @ts-ignore: Variable declared but never read
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'title') this.updateTitle();
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.setUpBody();
        this.updateTitle();
        const item = document.createElement('vaadin-item');
        const titleDiv = document.createElement('div');
        titleDiv.append(this.titleElement);
        item.append(titleDiv, this.body!);
        this.shadowRoot!.append(item);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) this.shadowRoot!.removeChild(child);
    }

    private setUpBody(): void {
        if (!this.body) {
            this.body = document.createElement('div');
            this.body.append(...this.childNodes);
        }
    }

    private updateTitle(): void {
        this.titleElement.textContent = this.title;
    }
}

customElements.define('titled-item', TitledItemElement);