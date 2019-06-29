import getInvalidMessenger from '../../tabs/message';
import * as categories from '../../storage/categories';
import * as validatedAdder from '../reusable/validated_adder';

/** An `add` event */
export class AddEvent extends Event {
    constructor(readonly data: string) {
        super('add');
    }
}

/**
 * This web component has the HTML name `category-adder`. It validates and adds categories to persistent storage.
 *
 * Example:
 * ```
 * <category-adder id="adder"></category-adder>
 * <script>
 *     document.querySelector('#adder').addEventListener('add', ({data}) => console.log(`Category ${data} added`));
 * </script>
 * ```
 */
export class CategoryAdderElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const adder = document.createElement('validated-adder') as validatedAdder.ValidatedAdderElement;
        adder.setAttribute('aria-label', 'Invalid category name');
        adder.getInvalidMessage = getInvalidMessenger();
        adder.addEventListener('add', (event) => {
            const {data} = (event as validatedAdder.AddEvent);
            categories.create(data);
            this.dispatchAdd(data);
        });
        this.shadowRoot!.appendChild(adder);
    }

    /**
     * Dispatches an [[AddEvent]]
     * @event Fired after a category has been added to persistent storage
     */
    private dispatchAdd(category: string): void {
        this.dispatchEvent(new AddEvent(category));
    }
}

customElements.define('category-adder', CategoryAdderElement);