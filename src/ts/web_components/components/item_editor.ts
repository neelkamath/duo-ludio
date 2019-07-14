// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore: Missing module declaration
import {ItemElement} from '@vaadin/vaadin-item/src/vaadin-item';
// @ts-ignore: Missing module declaration
import {TextFieldElement} from '@vaadin/vaadin-text-field/src/vaadin-text-field';
import ConfirmDialogElement from './confirm_dialog';
import DismissDialogElement from './dismiss_dialog';
import {InvalidityMessenger} from '../invalid_message';

export class RenameEvent extends Event {
    constructor(readonly oldName: string, readonly newName: string) {
        super('rename');
    }
}

/**
 * This web component has the HTML name `item-editor`. It contains an item's name which can be edited or deleted. Assign
 * [[getInvalidMessage]] before the user interacts with this element.
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
 * @attribute `item` (required) The item (e.g., `Meditation`)
 */
export class ItemEditorElement extends HTMLElement {
    getInvalidMessage!: InvalidityMessenger;
    private readonly deleteDialog = document.createElement('confirm-dialog') as ConfirmDialogElement;
    private readonly errorDialog = document.createElement('dismiss-dialog') as DismissDialogElement;
    private readonly renameDialog = document.createElement('confirm-dialog') as ConfirmDialogElement;
    private readonly field: TextFieldElement = document.createElement('vaadin-text-field');
    /** The item name placed next to the buttons */
    private readonly itemElement = document.createTextNode('');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.field.label = 'Rename';
    }

    static get observedAttributes() {
        return ['item'];
    }

    get item(): string {
        return this.getAttribute('item')!;
    }

    set item(value: string) {
        this.setAttribute('item', value);
    }

    // @ts-ignore: Variable declared but never read
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'item') this.updateItem();
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.setUpDeleteDialog();
        this.setUpRenameDialog();
        this.field.value = this.item;
        this.shadowRoot!.append(this.deleteDialog, this.errorDialog, this.renameDialog, this.getItem());
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
    }

    private getItem(): ItemElement {
        const item = document.createElement('vaadin-item');
        this.updateItem();
        item.append(this.getDeleteButton(), this.getEditButton(), this.itemElement);
        return item;
    }

    /**
     * Dispatches the `delete` `Event`
     *
     * Fired after this element is removed from the DOM
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

    private setUpRenameDialog(): void {
        this.renameDialog.setAttribute('aria-label', `Rename ${this.item}`);
        this.renameDialog.confirm = 'Rename';
        this.renameDialog.noCloseOnConfirm = true;
        this.renameDialog.append(this.field);
    }

    private setUpDeleteDialog(): void {
        this.deleteDialog.setAttribute('aria-label', 'Edit item');
        this.deleteDialog.cancel = 'No';
        this.deleteDialog.confirm = 'Delete';
        this.deleteDialog.textContent = `Delete ${this.item}?`;
    }

    private updateItem(): void {
        this.itemElement.textContent = this.item;
    }
}

customElements.define('item-editor', ItemEditorElement);