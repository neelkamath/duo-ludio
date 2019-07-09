// @ts-ignore: Missing module declaration
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
 * @attribute `aria-label` (optional) ARIA label (e.g., `Invalid category name`)
 */
export default class DismissDialogElement extends HTMLElement {
    private connectedOnce = false;
    private readonly dialog: DialogElement = document.createElement('vaadin-dialog');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        if (this.hasAttribute('aria-label')) {
            this.dialog.ariaLabel = this.getAttribute('aria-label');
        }
        this.shadowRoot!.append(this.dialog);
    }

    renderHTML(html: string): void {
        const span = document.createElement('span');
        span.innerHTML = html;
        this.dialog.renderer = (root: HTMLElement) => root.append(span);
        this.dialog.opened = true;
    }

    render(child: HTMLElement): void {
        this.dialog.renderer = (root: HTMLElement) => root.append(child);
        this.dialog.opened = true;
    }
}

customElements.define('dismiss-dialog', DismissDialogElement);