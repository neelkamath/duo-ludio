import DismissDialogElement from './dismiss_dialog';
import * as itemAdder from './add_item';
import {invalidityMessenger} from '../invalid_message';

/** An `add` event */
export class AddEvent extends Event {
    constructor(readonly data: string) {
        super('add');
    }
}

/**
 * This web component has the HTML name `validated-adder`. It contains a field to add a validatable item. Supply
 * [[ValidatedAdderElement.getInvalidMessage]] ASAP.
 *
 * Example:
 * ```
 * <validated-adder id="new-category" aria-label="Invalid category name"></validated-adder>
 * <script>
 *     const adder = document.querySelector('#new-category');
 *     adder.getInvalidMessage = (name) => name === '' ? 'Please enter a name' : null;
 *     adder.addEventListener('add', ({data}) => console.log(data);
 * </script>
 * ```
 *
 * @attribute `aria-label` (optional) If the item name being added is invalid, a dialog having this ARIA label will
 * display explaining why (e.g., `Invalid category name`)
 */
export class ValidatedAdderElement extends HTMLElement {
    getInvalidMessage!: invalidityMessenger;
    private readonly dialog: DismissDialogElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.dialog = document.createElement('dismiss-dialog') as DismissDialogElement;
    }

    connectedCallback() {
        if (this.hasAttribute('aria-label')) {
            this.dialog.setAttribute('aria-label', this.getAttribute('aria-label')!);
        }
        this.shadowRoot!.appendChild(this.dialog);
        this.shadowRoot!.appendChild(this.getItem());
    }

    /**
     * Dispatches an [[AddEvent]]
     * @event Fired when a valid item name has been added
     * @param data Name to be added
     */
    private dispatchAdd(data: string): void {
        this.dispatchEvent(new AddEvent(data));
    }

    private getItem(): itemAdder.ItemAdderElement {
        const item = document.createElement('add-item') as itemAdder.ItemAdderElement;
        item.addEventListener('add', (event) => {
            const {data} = (event as itemAdder.AddEvent);
            const name = data.trim();
            const message = this.getInvalidMessage(name);
            if (message === null) {
                this.dispatchAdd(data);
                return;
            }
            const span = document.createElement('span');
            span.innerHTML = message;
            this.dialog.render(span);
        });
        return item;
    }
}

customElements.define('validated-adder', ValidatedAdderElement);