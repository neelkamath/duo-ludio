// @ts-ignore
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore
import {ItemElement} from '@vaadin/vaadin-item/src/vaadin-item';
// @ts-ignore
import {TextFieldElement} from '@vaadin/vaadin-text-field/src/vaadin-text-field';
import ConfirmDialogElement from './confirm_dialog';
import DismissDialogElement from './dismiss_dialog';
import {invalidityMessenger} from '../invalid_message';

export class RenameEvent extends Event {
    constructor(readonly oldName: string, readonly newName: string) {
        super('rename');
    }
}

/**
 * This web component has the HTML name `item-editor`. It contains an item's name which can be edited or deleted. Attach
 * [[getInvalidMessage]] ASAP.
 *
 * Example:
 * ```
 * <item-editor id="editor" item="Meditation"></item-editor>
 * <script>
 *     const editor = document.querySelector('#editor');
 *     editor.getInvalidMessage = (name) => name === '' ? 'The name cannot be empty' : null;
 *     editor.addEventListener('delete', () => console.log('Item should be deleted'));
 *     editor.addEventListener('rename', ({oldName, newName}) => console.log(`${oldName} updated to ${newName}`));
 * </script>
 ```
 *
 * @attribute `item` (required) The item (e.g., `Meditation`)
 */
export class ItemEditorElement extends HTMLElement {
    getInvalidMessage!: invalidityMessenger;
    private readonly deleteDialog: ConfirmDialogElement;
    private readonly errorDialog: DismissDialogElement;
    private readonly renameDialog: ConfirmDialogElement;
    private readonly field: TextFieldElement;
    /** The readonly item name placed next to the buttons */
    private readonly itemName: HTMLSpanElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.deleteDialog = document.createElement('confirm-dialog') as ConfirmDialogElement;
        this.errorDialog = document.createElement('dismiss-dialog') as DismissDialogElement;
        this.renameDialog = document.createElement('confirm-dialog') as ConfirmDialogElement;
        this.field = document.createElement('vaadin-text-field');
        this.itemName = document.createElement('span');
    }

    private get item(): string {
        return this.getAttribute('item')!;
    }

    private set item(value: string) {
        this.setAttribute('item', value);
        this.itemName.textContent = this.item;
    }

    connectedCallback() {
        this.setUpDeleteDialog();
        this.setUpRenameDialog();
        this.setUpField();
        this.itemName.textContent = this.item;
        this.shadowRoot!.appendChild(this.deleteDialog);
        this.shadowRoot!.appendChild(this.errorDialog);
        this.shadowRoot!.appendChild(this.renameDialog);
        this.shadowRoot!.appendChild(this.getItem());
    }

    private getItem(): ItemElement {
        const item = document.createElement('vaadin-item');
        item.appendChild(this.getDeleteButton());
        item.appendChild(this.getEditButton());
        item.appendChild(this.itemName);
        return item;
    }

    /**
     * Dispatches the `delete` `Event`
     *
     * Fired after this element is removed from the DOM (i.e., the item was deleted)
     *
     * @event
     */
    private dispatchDelete(): void {
        this.dispatchEvent(new Event('delete'));
    }

    /**
     * Dispatches a [[RenameEvent]]
     *
     * Fired each time the item's name has been successfully changed (i.e., the user edited the item's name, and
     * [[getInvalidMessage]] returned `null`)
     *
     * @event
     */
    private dispatchRename(oldName: string, newName: string): void {
        this.dispatchEvent(new RenameEvent(oldName, newName));
    }

    private getDeleteButton(): ButtonElement {
        const button = document.createElement('vaadin-button') as ButtonElement;
        button.ariaLabel = 'Delete item';
        button.theme = 'icon';
        button.innerHTML = '<iron-icon icon="vaadin:minus"></iron-icon>';
        button.addEventListener('click', () => {
            this.deleteDialog.render();
            this.deleteDialog.addEventListener('confirm', () => {
                this.remove();
                this.dispatchDelete();
            });
        });
        return button;
    }

    private getEditButton(): ButtonElement {
        const button = document.createElement('vaadin-button') as ButtonElement;
        button.ariaLabel = 'Rename';
        button.theme = 'icon';
        button.innerHTML = '<iron-icon icon="vaadin:pencil"></iron-icon>';
        button.addEventListener('click', () => this.renameDialog.render());
        this.renameDialog.addEventListener('confirm', () => this.handleConfirmedEdit());
        return button;
    }

    private async handleConfirmedEdit(): Promise<void> {
        if (this.field.value === this.item) {
            this.renameDialog.close();
            return;
        }
        const html = await this.getInvalidMessage(this.field.value);
        if (html) {
            this.field.value = this.item;
            this.errorDialog.renderHTML(html);
        } else {
            this.dispatchRename(this.item, this.field.value);
            this.item = this.field.value;
            this.renameDialog.close();
        }
    }

    private setUpField(): void {
        this.field.label = 'Rename';
        this.field.value = this.item;
    }

    private setUpRenameDialog(): void {
        this.renameDialog.setAttribute('aria-label', `Rename ${this.item}`);
        this.renameDialog.setAttribute('confirm', 'Rename');
        this.renameDialog.setAttribute('no-confirm-close', 'no-confirm-close');
        this.renameDialog.appendChild(this.field);
    }

    private setUpDeleteDialog(): void {
        this.deleteDialog.setAttribute('aria-label', 'Edit item');
        this.deleteDialog.setAttribute('cancel', 'No');
        this.deleteDialog.setAttribute('confirm', 'Delete');
        this.deleteDialog.textContent = `Delete ${this.item}?`;
    }
}

customElements.define('item-editor', ItemEditorElement);