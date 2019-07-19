// @ts-ignore: Missing module declaration
import {DialogElement} from '@vaadin/vaadin-dialog/src/vaadin-dialog';
import DialogButtonElement from './dialog-button';

/**
 * This web component has the HTML name `confirm-dialog`. It was created because Vaadin's confirm dialog wasn't free.
 * Place the body HTML between this element's HTML tags. Render the dialog using [[render]].
 *
 * Example:
 * ```
 * <confirm-dialog confirm="Delete" dialog-title="Delete?" id="dialog">
 *     This will permanently delete the photo.
 * </confirm-dialog>
 * <label>Delete photo<input type="button" id="delete"></label>
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
 * @attribute `dialog-title` (optional) Title (e.g., `Delete?`)
 * @attribute `cancel` (optional, default: `Cancel`) Cancel button text (e.g., `No`)
 * @attribute `confirm` (optional, default: `Confirm`) Confirm button text (e.g., `Delete`)
 * @attribute `no-close-on-confirm` (optional) This boolean attribute indicates whether this dialog will not
 * automatically close when the confirm button is clicked. You should instead close it manually using [[close]].
 */
export default class ConfirmDialogElement extends HTMLElement {
    private readonly dialog: DialogElement = document.createElement('vaadin-dialog');
    private readonly titleElement: HTMLDivElement = document.createElement('div');
    private readonly cancelElement = document.createElement('dialog-button') as DialogButtonElement;
    private readonly confirmElement = document.createElement('dialog-button') as DialogButtonElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
        return ['dialog-title', 'cancel', 'confirm'];
    }

    get dialogTitle(): string | null {
        return this.getAttribute('dialog-title');
    }

    set dialogTitle(value: string | null) {
        if (value) {
            this.setAttribute('dialog-title', value);
        } else {
            this.removeAttribute('dialog-title');
        }
    }

    get cancel(): string {
        return this.getAttribute('cancel') || 'Cancel';
    }

    set cancel(value: string) {
        this.setAttribute('cancel', value);
    }

    get confirm(): string {
        return this.getAttribute('confirm') || 'Confirm';
    }

    set confirm(value: string) {
        this.setAttribute('confirm', value);
    }

    get noCloseOnConfirm(): boolean {
        return this.hasAttribute('no-close-on-confirm');
    }

    set noCloseOnConfirm(value: boolean) {
        if (value) {
            this.setAttribute('no-close-on-confirm', '')
        } else {
            this.removeAttribute('no-close-on-confirm')
        }
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
    }

    // @ts-ignore: Variable declared but never read
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'dialog-title':
                this.updateTitle();
                break;
            case 'cancel':
                this.updateCancel();
                break;
            case 'confirm':
                this.updateConfirm();
        }
    }

    render(): void {
        this.dialog.opened = true;
    }

    close(): void {
        this.dialog.opened = false;
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.updateTitle();
        this.setUpCancel();
        this.setUpConfirm();
        this.dialog.noCloseOnEsc = true;
        this.dialog.noCloseOnOutsideClick = true;
        this.dialog.ariaLabel = this.getAttribute('aria-label') || 'Confirm';
        this.setUpRenderer();
        this.shadowRoot!.append(this.dialog);
    }

    private updateTitle(): void {
        if (this.title) {
            const strong = document.createElement('strong');
            strong.textContent = this.dialogTitle;
            this.titleElement.append(strong, document.createElement('br'));
        } else {
            for (const child of this.titleElement.childNodes) child.remove();
        }
    }

    private setUpRenderer(): void {
        this.dialog.renderer = (root: HTMLElement) => {
            if (root.hasChildNodes()) return;
            root.append(this.titleElement);
            if (this.childNodes.length > 0) {
                const div = document.createElement('div');
                div.append(...this.childNodes);
                root.append(div);
            }
            root.append(this.confirmElement, this.cancelElement);
        };
    }

    private setUpConfirm(): void {
        this.updateConfirm();
        this.confirmElement.addEventListener('click', () => {
            if (!this.noCloseOnConfirm) this.close();
            this.dispatchConfirm();
        });
    }

    /**
     * Dispatches the `confirm` `Event`
     *
     * Fired when the confirm button is clicked
     * @event
     */
    private dispatchConfirm(): void {
        this.dispatchEvent(new Event('confirm'));
    }

    private setUpCancel(): void {
        this.updateCancel();
        this.cancelElement.addEventListener('click', () => this.close());
    }

    private updateCancel(): void {
        this.cancelElement.text = this.cancel;
    }

    private updateConfirm(): void {
        this.confirmElement.text = this.confirm;
    }
}

customElements.define('confirm-dialog', ConfirmDialogElement);