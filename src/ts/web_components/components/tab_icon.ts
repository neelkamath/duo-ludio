/**
 * This web component has the HTML name `tab-icon`.
 *
 * Example: `<tab-icon alt="Alpha" src="https://bit.ly/2wTc8tv"></tab-icon>`
 * @attribute `alt` (required) Alternative text to display if the icon can't be seen (e.g., `Alpha`)
 * @attribute `src` (required) Icon's source (e.g., `https://bit.ly/2wTc8tv`)
 */
export default class TabIconElement extends HTMLElement {
    private readonly image: HTMLImageElement = document.createElement('img');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
        return ['alt', 'src'];
    }

    get alt(): string {
        return this.getAttribute('alt')!;
    }

    set alt(value: string) {
        this.setAttribute('alt', value);
        this.updateAlt();
    }

    get src(): string {
        return this.getAttribute('src')!;
    }

    set src(value: string) {
        this.setAttribute('src', value);
        this.updateSrc();
    }

    // @ts-ignore: Variable declared but never read
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'alt':
                this.updateAlt();
                break;
            case 'src':
                this.updateSrc();
        }
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.updateAlt();
        this.updateSrc();
        this.image.style.height = this.image.style.width = '24px';
        this.shadowRoot!.append(this.image);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) this.shadowRoot!.removeChild(child);
    }

    private updateAlt(): void {
        this.image.alt = this.alt;
    }

    private updateSrc(): void {
        this.image.src = this.src;
    }
}

customElements.define('tab-icon', TabIconElement);