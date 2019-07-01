// @ts-ignore
import {DialogElement} from '@vaadin/vaadin-dialog/src/vaadin-dialog';

/**
 * This web component has the HTML name `dismiss-dialog`. It is for dialogs requiring no buttons. Use
 * [[render]] or [[renderHTML]] to render the dialog.
 *
 * Example:
 * ```
 * <ok-dialog id="dialog"></ok-dialog>
 * <vaadin-button id="submit">Submit</vaadin-button>
 * <script>
 *     document.querySelector('#submit').addEventListener('click', () => {
 *         document.querySelector('#dialog').renderHTML('Please enter your <b>name</b>.');
 *     });
 * </script>
 * ```
 *
 * @attribute `aria-label` (optional) ARIA label (e.g., `Invalid category name`)
 */
export default class DismissDialogElement extends HTMLElement {
    private readonly dialog: DialogElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.dialog = document.createElement('vaadin-dialog');
    }

    connectedCallback() {
        if (this.hasAttribute('aria-label')) {
            this.dialog.ariaLabel = this.getAttribute('aria-label');
        }
        this.shadowRoot!.appendChild(this.dialog);
    }

    renderHTML(html: string): void {
        const span = document.createElement('span');
        span.innerHTML = html;
        this.dialog.renderer = (root: HTMLElement) => root.appendChild(span);
        this.dialog.opened = true;
    }

    render(child: HTMLElement): void {
        this.dialog.renderer = (root: HTMLElement) => root.appendChild(child);
        this.dialog.opened = true;
    }
}

customElements.define('dismiss-dialog', DismissDialogElement);