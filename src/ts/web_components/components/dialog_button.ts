// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';

/**
 * This web component has the HTML name `dialog-button`. It is an alternative to `vaadin-button` for dialogs, since
 * `vaadin-button`s do not follow Material Design's spec very well. When placing multiple `dialog-button`s next to each
 * other, list them in reverse order.
 *
 * Example:
 * ```
 * <dialog-button text="OK" id="button"></dialog-button>
 * <script>document.querySelector('#button').addEventListener('click', () => console.log('Clicked'));</script>
 * ```
 */
export default class DialogButtonElement extends HTMLElement {
    private readonly button: ButtonElement = document.createElement('vaadin-button');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
        return ['text'];
    }

    get text(): string {
        return this.getAttribute('text')!;
    }

    set text(value: string) {
        this.setAttribute('text', value);
    }

    // @ts-ignore: Variable declared but not used
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'text') this.updateText();
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.updateText();
        this.button.style.cssFloat = 'right';
        this.button.style.margin = '1em 0';
        this.shadowRoot!.append(this.button);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
    }

    private updateText(): void {
        this.button.textContent = this.text;
    }
}

customElements.define('dialog-button', DialogButtonElement);