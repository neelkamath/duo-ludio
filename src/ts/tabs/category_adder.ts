import * as message from './message';
import * as storage from '../storage';
import {ValidatedAdderElement} from '../web_components/validated_adder';

/**
 * This web component has the HTML name `category-adder`. It validates and adds categories to persistent storage.
 *
 * The `add` `CustomEvent` is fired after a category has been added to persistent storage. The event's `detail` will
 * contain the category name.
 *
 * Example:
 * ```
 * <category-adder id="adder"></category-adder>
 * <script>
 *     document.querySelector('#adder').addEventListener('add', ({detail}) => console.log(`Category ${detail} added`));
 * </script>
 * ```
 */
export class CategoryAdderElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const adder = document.createElement('validated-adder') as ValidatedAdderElement;
        adder.setAttribute('aria-label', 'Invalid category name');
        adder.getInvalidMessage = message.getInvalidMessenger();
        adder.addEventListener('add', ({detail}: CustomEvent) => {
            storage.createCategory(detail);
            this.dispatchEvent(new CustomEvent('add', {detail}));
        });
        this.shadowRoot!.appendChild(adder);
    }
}

customElements.define('category-adder', CategoryAdderElement);