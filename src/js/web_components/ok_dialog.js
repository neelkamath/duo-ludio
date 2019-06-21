import * as utility from '../utility';

class OKDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static _getDialogContent(message) {
        return `
            <span id="content">
                <div>${utility.escapeHTML(message)}</div>
                <dialog-button id="button">OK</dialog-button>
            </span>
        `;
    }

    connectedCallback() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-dialog id="dialog" ${utility.getAttribute(this, 'aria-label')}></vaadin-dialog>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(message) {
        let dialog = this.shadowRoot.querySelector('#dialog');
        dialog.renderer = (root) => root.innerHTML = OKDialog._getDialogContent(message);
        dialog.opened = true;
        let button = document.querySelector('#content').querySelector('#button');
        button.addEventListener('click', () => dialog.opened = false);
    }
}

customElements.define('ok-dialog', OKDialog);