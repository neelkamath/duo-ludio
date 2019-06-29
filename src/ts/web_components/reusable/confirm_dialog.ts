// @ts-ignore
import {DialogElement} from '@vaadin/vaadin-dialog/src/vaadin-dialog';
import DialogButtonElement from './dialog_button';

/**
 * This web component has the HTML name `confirm-dialog`. It was created because Vaadin's confirm dialog wasn't free.
 * Place the body HTML between this element's HTML tags. Render the dialog using [[ConfirmDialogElement.render]].
 *
 * Example:
 * ```
 * <confirm-dialog confirm="Delete" id="dialog" title="Delete?">This will permanently delete the photo.</confirm-dialog>
 * <vaadin-button id="delete">Delete photo</vaadin-button>
 * <script>
 *     document.querySelector('#delete').addEventListener('click', () => {
 *         const dialog = document.querySelector('#dialog');
 *         dialog.render();
 *         dialog.addEventListener('confirm', () => console.log('Confirmed'));
 *     });
 * </script>
 * ```
 *
 * @attribute `aria-label` (optional, default: `Confirm`) ARIA label (e.g., `Confirm deleting category Meditation`)
 * @attribute `title` (required) Title (e.g., `Delete?`)
 * @attribute `cancel` (optional, default: `Cancel`) Cancel button text (e.g., `No`)
 * @attribute `confirm` (optional, default: `Confirm`) Confirm button text (e.g., `Delete`)
 */
export default class ConfirmDialogElement extends HTMLElement {
    private readonly dialog: DialogElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.dialog = document.createElement('vaadin-dialog');
    }

    render(): void {
        this.dialog.renderer = (root: HTMLElement) => {
            root.appendChild(this.getTitle());
            root.appendChild(document.createElement('br'));
            const div = document.createElement('div');
            div.innerHTML = this.innerHTML;
            root.appendChild(div);
            root.appendChild(this.getConfirm());
            root.appendChild(this.getCancel());
        };
        this.dialog.opened = true;
    }

    private getTitle(): HTMLDivElement {
        const div = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = this.getAttribute('title');
        div.appendChild(strong);
        return div;
    }

    private getConfirm(): DialogButtonElement {
        const button = document.createElement('dialog-button') as DialogButtonElement;
        let content = 'Confirm';
        if (this.hasAttribute('confirm')) content = this.getAttribute('confirm')!;
        button.textContent = content;
        button.addEventListener('click', () => {
            this.dialog.opened = false;
            this.dispatchConfirm();
        });
        return button;
    }

    /**
     * Dispatches the `confirm` `Event`
     * @event Fired when the confirm button is clicked
     */
    private dispatchConfirm(): void {
        this.dispatchEvent(new Event('confirm'));
    }

    connectedCallback() {
        this.dialog.noCloseOnEsc = true;
        this.dialog.noCloseOnOutsideClick = true;
        let label = 'Confirm';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label')!;
        this.dialog.ariaLabel = label;
        this.shadowRoot!.appendChild(this.dialog);
    }

    private getCancel(): DialogButtonElement {
        const button = document.createElement('dialog-button') as DialogButtonElement;
        let cancel = 'Cancel';
        if (this.hasAttribute('cancel')) cancel = this.getAttribute('cancel')!;
        button.textContent = cancel;
        button.addEventListener('click', () => this.dialog.opened = false);
        return button;
    }
}

customElements.define('confirm-dialog', ConfirmDialogElement);