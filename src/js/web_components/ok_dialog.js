import * as utility from '../utility';

class OKDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `<vaadin-dialog id="dialog" ${this._ariaLabel}></vaadin-dialog>`;
        return template.content;
    }

    get _ariaLabel() {
        let label = '';
        if (this.hasAttribute('aria-label')) {
            label = `aria-label="${this.getAttribute('aria-label')}"`;
        }
        return label;
    }

    static _getDialogContent(message) {
        return `
            <span id="content">
                <div>${message}</div>
                <dialog-button id="button">OK</dialog-button>
            </span>
        `;
    }

    render(message) {
        let dialog = this.shadowRoot.querySelector('#dialog');
        dialog.renderer = (root) => root.innerHTML = OKDialog._getDialogContent(message);
        dialog.opened = true;
        let button = document.querySelector('#content').querySelector('#button');
        button.addEventListener('click', () => {
            utility.runAfterButtonAnimation(() => dialog.opened = false);
        });
    }
}

customElements.define('ok-dialog', OKDialog);