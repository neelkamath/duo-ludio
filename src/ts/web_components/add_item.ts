import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
import {TextFieldElement} from '@vaadin/vaadin-text-field/src/vaadin-text-field';

/**
 * This web component has the HTML name `add-item`. It contains a text field for the user to enter the name of an item
 * they'd like to add, and a button to add it. When the button is clicked, the text field is cleared.
 *
 * The `add` `CustomEvent` is fired when an item is to be added. The event's `detail` contains the field's value.
 *
 * Example:
 * ```
 * <add-item id="new-item"></add-item>
 * <script>
 *     const adder = document.querySelector('#new-item');
 *     adder.addEventListener('add', ({detail}) => console.log(detail.trim()));
 * </script>
 ```
 */
export class ItemAdderElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const field = document.createElement('vaadin-text-field') as TextFieldElement;
        field.label = 'Item name';
        field.placeholder = 'Mindless HW';
        this.shadowRoot!.appendChild(field);
        this.shadowRoot!.appendChild(this.getButton(field));
    }

    private getButton(field: TextFieldElement): ButtonElement {
        const button = document.createElement('vaadin-button') as ButtonElement;
        button.ariaLabel = 'Add item';
        button.theme = 'icon';
        button.innerHTML = '<iron-icon icon="vaadin:plus"></iron-icon>';
        button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add', {detail: field.value}));
            field.value = '';
        });
        return button;
    }
}

customElements.define('add-item', ItemAdderElement);