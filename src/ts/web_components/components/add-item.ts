// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore: Missing module declaration
import {TextFieldElement} from '@vaadin/vaadin-text-field/src/vaadin-text-field';

/** An `add` event */
export class AddEvent extends Event {
    constructor(readonly data: string) {
        super('add');
    }
}

/**
 * This web component has the HTML name `add-item`. It contains a text field for the user to enter the name of an item
 * they'd like to add, and a button to add it. When the button is clicked, the text field is cleared.
 *
 * Example:
 * ```
 * <add-item id="new-item"></add-item>
 * <script>document.querySelector('#new-item').addEventListener('add', ({data}) => console.log(data.trim()));</script>
 ```
 */
export class ItemAdderElement extends HTMLElement {
    private readonly field = document.createElement('vaadin-text-field') as TextFieldElement;
    private readonly button = document.createElement('vaadin-button') as ButtonElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.field.label = 'Item name';
        this.field.placeholder = 'Mindless HW';
        this.button.ariaLabel = 'Add item';
        this.button.theme = 'icon';
        this.button.innerHTML = '<iron-icon icon="vaadin:plus"></iron-icon>';
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.button.addEventListener('click', () => {
            this.dispatchAdd(this.field.value);
            this.field.value = '';
        });
        this.shadowRoot!.append(this.field, this.button);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
    }

    /**
     * Dispatches an [[AddEvent]]
     *
     * Fired when an item is to be added
     * @param data Field's value
     * @event
     */
    private dispatchAdd(data: string): void {
        this.dispatchEvent(new AddEvent(data));
    }
}

customElements.define('add-item', ItemAdderElement);