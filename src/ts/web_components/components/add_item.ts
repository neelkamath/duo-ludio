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
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (!this.isConnected) return;
        const field = document.createElement('vaadin-text-field') as TextFieldElement;
        field.label = 'Item name';
        field.placeholder = 'Mindless HW';
        this.shadowRoot!.append(field, this.getButton(field));
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) this.shadowRoot!.removeChild(child);
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

    private getButton(field: TextFieldElement): ButtonElement {
        const button = document.createElement('vaadin-button') as ButtonElement;
        button.ariaLabel = 'Add item';
        button.theme = 'icon';
        button.innerHTML = '<iron-icon icon="vaadin:plus"></iron-icon>';
        button.addEventListener('click', () => {
            this.dispatchAdd(field.value);
            field.value = '';
        });
        return button;
    }
}

customElements.define('add-item', ItemAdderElement);