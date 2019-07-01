// @ts-ignore
import {DialogElement} from '@vaadin/vaadin-dialog/src/vaadin-dialog';
import DialogButtonElement from './dialog_button';

/**
 * This web component has the HTML name `confirm-dialog`. It was created because Vaadin's confirm dialog wasn't free.
 * Place the body HTML between this element's HTML tags. Render the dialog using [[render]].
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
 * @attribute `title` (optional) Title (e.g., `Delete?`)
 * @attribute `cancel` (optional, default: `Cancel`) Cancel button text (e.g., `No`)
 * @attribute `confirm` (optional, default: `Confirm`) Confirm button text (e.g., `Delete`)
 * @attribute `no-confirm-close` (optional) If this boolean attribute is present, this dialog will not automatically
 * close when the confirm button is clicked. You should instead manually close it using [[close]].
 */
export default class ConfirmDialogElement extends HTMLElement {
    private content!: ChildNode | null;
    private readonly dialog: DialogElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.dialog = document.createElement('vaadin-dialog');
    }

    render(): void {
        this.dialog.renderer = (root: HTMLElement) => {
            if (this.hasAttribute('title')) root.appendChild(this.getTitle());
            root.appendChild(document.createElement('br'));
            if (this.content !== null) {
                const div = document.createElement('div');
                div.appendChild(this.content);
                root.appendChild(div);
            }
            root.appendChild(this.getConfirm());
            root.appendChild(this.getCancel());
        };
        this.dialog.opened = true;
    }

    connectedCallback() {
        this.content = this.firstChild;
        this.dialog.noCloseOnEsc = true;
        this.dialog.noCloseOnOutsideClick = true;
        let label = 'Confirm';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label')!;
        this.dialog.ariaLabel = label;
        this.shadowRoot!.appendChild(this.dialog);
    }

    close(): void {
        this.dialog.opened = false;
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
            if (!this.hasAttribute('no-confirm-close')) this.dialog.opened = false;
            this.dispatchConfirm();
        });
        return button;
    }

    /**
     * Dispatches the `confirm` `Event`
     *
     * Fired when the confirm button is clicked
     *
     * @event
     */
    private dispatchConfirm(): void {
        this.dispatchEvent(new Event('confirm'));
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