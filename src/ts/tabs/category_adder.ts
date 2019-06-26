import * as message from './message';
import * as storage from "../storage";

class CategoryAdder extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        let adder: any = document.createElement('validated-adder');
        adder.setAttribute('aria-label', 'Invalid category name');
        adder.getInvalidMessage = message.getInvalidMessage;
        adder.addEventListener('add', ({detail}: CustomEvent) => {
            storage.createCategory(detail);
            this.dispatchEvent(new CustomEvent('add', {detail}));
        });
        this.shadowRoot!.appendChild(adder);
    }
}

customElements.define('category-adder', CategoryAdder);