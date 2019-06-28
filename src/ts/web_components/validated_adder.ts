import {DismissDialogElement} from './dismiss_dialog';
import {ItemAdderElement} from './add_item';
import {getInvalidMessage} from './invalid_message';

/**
 * This web component has the HTML name `validated-adder`. It contains a field to add a validatable item. Supply
 * [[ValidatedAdderElement.getInvalidMessage]] ASAP.
 *
 * The `add` `Event` is fired when a valid item name has been added. The event's `detail` contains the name to be added.
 *
 * Example:
 * ```
 * <validated-adder id="new-category" aria-label="Invalid category name"></validated-adder>
 * <script>
 *     const adder = document.querySelector('#new-category');
 *     adder.getInvalidMessage = (name) => name === '' ? 'Please enter a name' : null;
 *     adder.addEventListener('add', ({detail}) => console.log(detail);
 * </script>
 * ```
 *
 * @attribute `aria-label` (optional) If the item name being added is invalid, a dialog having this ARIA label will
 * display explaining why (e.g., `Invalid category name`)
 */
export class ValidatedAdderElement extends HTMLElement {
    getInvalidMessage: getInvalidMessage;
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

    private getItem(): ItemAdderElement {
        const item = document.createElement('add-item') as ItemAdderElement;
        item.addEventListener('add', ({detail}: CustomEvent) => {
            const name = detail.trim();
            const message = this.getInvalidMessage(name);
            if (message === null) {
                this.dispatchEvent(new CustomEvent('add', {detail: name}));
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