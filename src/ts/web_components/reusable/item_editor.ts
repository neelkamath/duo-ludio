// @ts-ignore
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore
import {TextFieldElement} from '@vaadin/vaadin-text-field/src/vaadin-text-field';
import ConfirmDialogElement from './confirm_dialog';
import DismissDialogElement from './dismiss_dialog';
import {invalidityMessenger} from '../invalid_message';

export class SetEvent extends Event {
    constructor(readonly oldName: string, readonly newName: string) {
        super('set');
    }
}

/**
 * This web component has the HTML name `item-editor`. It contains an item's name which can be edited or deleted. Attach
 * [[ItemEditorElement.getInvalidMessage]] ASAP.
 *
 * Example:
 * ```
 * <item-editor
 *         dialog-body="This will delete the category Meditation."
 *         dialog-confirm="Delete"
 *         dialog-title="Delete?"
 *         id="editor"
 *         item="Meditation"
 * ></item-editor>
 * <script>
 *     const editor = document.querySelector('#editor');
 *     editor.addEventListener('delete', () => console.log('Item should be deleted'));
 *     editor.getInvalidMessage = (name) => name === '' ? 'The name cannot be empty' : null;
 *     editor.addEventListener('set', ({oldName, newName}) => console.log(`${oldName} updated to ${newName}`));
 * </script>
 ```
 *
 * @attribute `aria-label` (optional, default: `Edit item`) ARIA label (e.g., `Edit category Meditation`)
 * @attribute `dialog-cancel` (optional, default: `Cancel`) Dialog's cancel button text (e.g., `No`)
 * @attribute `dialog-confirm` (optional, default: `Confirm`) Dialog's confirm button text (e.g., `Delete`)
 * @attribute `dialog-title` (required) Dialog's title (e.g., `Delete?`)
 * @attribute `dialog-body` (required) Dialog's body (e.g., `This will delete the category Meditation.`)
 * @attribute `item` (required) The item (e.g., `Meditation`)
 */
export class ItemEditorElement extends HTMLElement {
    getInvalidMessage!: invalidityMessenger;
    private readonly confirmDialog: ConfirmDialogElement;
    private readonly dismissDialog: DismissDialogElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.confirmDialog = document.createElement('confirm-dialog') as ConfirmDialogElement;
        this.dismissDialog = document.createElement('dismiss-dialog') as DismissDialogElement;
    }

    private get item(): string {
        return this.getAttribute('item')!;
    }

    private set item(value: string) {
        this.setAttribute('item', value);
    }

    connectedCallback() {
        this.setUpConfirmDialog();
        const div = document.createElement('div');
        div.appendChild(this.confirmDialog);
        div.appendChild(this.dismissDialog);
        div.appendChild(this.getField());
        div.appendChild(this.getButton());
        this.shadowRoot!.appendChild(div);
    }

    /**
     * Dispatches the `delete` `Event`
     * @event Fired after this element is removed from the DOM (i.e., the item was deleted)
     */
    private dispatchDelete(): void {
        this.dispatchEvent(new Event('delete'));
    }

    /**
     * Dispatches a [[SetEvent]]
     * @event Fired each time the item's name has been successfully changed (i.e., the user edited the item's name, and
     * [[ItemEditorElement.getInvalidMessage]] returned `null`)
     */
    private dispatchSet(oldName: string, newName: string): void {
        this.dispatchEvent(new SetEvent(oldName, newName));
    }

    private getField(): TextFieldElement {
        const field = document.createElement('vaadin-text-field') as TextFieldElement;
        field.id = 'field';
        field.label = 'Rename';
        field.value = this.item;
        field.addEventListener('change', async () => {
            const html = await this.getInvalidMessage(field.value);
            if (html) {
                field.value = this.item;
                const span = document.createElement('span');
                span.innerHTML = html;
                this.dismissDialog.render(span);
            } else {
                this.dispatchSet(this.item, field.value);
                this.item = field.value;
            }
        });
        return field;
    }

    private getButton(): ButtonElement {
        const button = document.createElement('vaadin-button') as ButtonElement;
        button.ariaLabel = 'Delete item';
        button.theme = 'icon';
        button.innerHTML = '<iron-icon icon="vaadin:minus"></iron-icon>';
        button.addEventListener('click', () => {
            this.confirmDialog.render();
            this.confirmDialog.addEventListener('confirm', () => {
                this.remove();
                this.dispatchDelete();
            });
        });
        return button;
    }

    private setUpConfirmDialog(): void {
        let label = 'Edit item';
        if (this.hasAttribute('aria-label')) label = this.getAttribute('aria-label')!;
        this.confirmDialog.setAttribute('aria-label', label);
        this.confirmDialog.title = this.getAttribute('dialog-title')!;
        let cancel = 'Cancel';
        if (this.hasAttribute('dialog-cancel')) cancel = this.getAttribute('dialog-cancel')!;
        this.confirmDialog.setAttribute('cancel', cancel);
        let confirm = 'Confirm';
        if (this.hasAttribute('dialog-confirm')) {
            confirm = this.getAttribute('dialog-confirm')!;
        }
        this.confirmDialog.setAttribute('confirm', confirm);
        this.confirmDialog.textContent = this.getAttribute('dialog-body');
    }
}

customElements.define('item-editor', ItemEditorElement);