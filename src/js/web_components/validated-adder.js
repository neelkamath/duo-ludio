import * as utility from '../utility';

class ValidatedAdder extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get _ariaLabel() {
        if (!this.hasAttribute('aria-label')) return '';
        return `aria-label="${utility.escapeHTML(this.getAttribute('aria-label'))}"`;
    }

    connectedCallback() {
        let template = document.createElement('template');
        template.innerHTML = `
            <dismiss-dialog id="dialog" ${this._ariaLabel}></dismiss-dialog>
            <add-item id="adder"></add-item>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._handleAdder();
    }

    _handleAdder() {
        let adder = this.shadowRoot.querySelector('#adder');
        adder.button.addEventListener('click', () => {
            let name = adder.field.value.trim();
            adder.field.value = '';
            let dialog = this.shadowRoot.querySelector('#dialog');
            let message = this.getInvalidMessage(name);
            if (message !== null) {
                dialog.render(message);
                return;
            }
            this.handleAdd(name);
        });
    }
}

customElements.define('validated-adder', ValidatedAdder);