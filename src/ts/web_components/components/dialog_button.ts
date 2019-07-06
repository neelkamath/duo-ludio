/**
 * This web component has the HTML name `dialog-button`. It is an alternative to `vaadin-button` for dialogs, since
 * `vaadin-button`s do not follow Material Design's spec very well. When placing multiple `dialog-button`s next to each
 * other, list them in reverse order. Place this button's HTML between this element's HTML tags.
 *
 * Example:
 * ```
 * <dialog-button id="button">OK</dialog-button>
 * <script>document.querySelector('#button').addEventListener('click', () => console.log('Clicked'));</script>
 * ```
 */
export default class DialogButtonElement extends HTMLElement {
    private connectedOnce = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        const button = document.createElement('vaadin-button');
        button.append(...this.childNodes);
        button.style.cssFloat = 'right';
        button.style.margin = '1em 0';
        this.shadowRoot!.append(button);
    }
}

customElements.define('dialog-button', DialogButtonElement);