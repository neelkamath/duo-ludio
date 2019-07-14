// @ts-ignore: Missing module declaration
import {DialogElement} from '@vaadin/vaadin-dialog/src/vaadin-dialog';

/**
 * This web component has the HTML name `dismiss-dialog`. It is for dialogs requiring no buttons. Use [[render]] or
 * [[renderHTML]] to render the dialog.
 *
 * Example:
 * ```
 * <ok-dialog id="dialog"></ok-dialog>
 * <label>Submit<input type="button" id="submit"></label>
 * <script>
 *     document.querySelector('#submit').addEventListener('click', () => {
 *         document.querySelector('#dialog').renderHTML('Please enter your <b>name</b>.');
 *     });
 * </script>
 * ```
 * @attribute `aria-label` (optional) ARIA label (e.g., `Invalid category name`)
 */
export default class DismissDialogElement extends HTMLElement {
    private readonly dialog: DialogElement = document.createElement('vaadin-dialog');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (!this.isConnected) return;
        if (this.hasAttribute('aria-label')) {
            this.dialog.ariaLabel = this.getAttribute('aria-label');
        }
        this.shadowRoot!.append(this.dialog);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
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