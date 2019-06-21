import * as utility from '../utility';

class ConfirmDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get _dialogContent() {
        return `
            <span id="content">
                <div><strong>${utility.getAttribute(this, 'title')}</strong></div>
                <br>
                <div>${this.innerHTML}</div>
                <dialog-button id="confirm">
                    ${utility.getAttribute(this, 'confirm', 'Confirm')}
                </dialog-button>
                <dialog-button id="cancel">
                    ${utility.getAttribute(this, 'cancel', 'Cancel')}
                </dialog-button>
            </span>
        `;
    }

    connectedCallback() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-dialog 
                no-close-on-esc 
                no-close-on-outside-click 
                id="dialog" 
                aria-label="${utility.getAttribute(this, 'aria-label', 'Confirm')}"
            ></vaadin-dialog>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render() {
        let dialog = this.shadowRoot.querySelector('#dialog');
        dialog.renderer = (root) => root.innerHTML = this._dialogContent;
        dialog.opened = true;
        this._addEventListeners(dialog);
    }

    _addEventListeners(dialog) {
        let content = document.querySelector('#content');
        content.querySelector('#cancel').addEventListener('click', () => dialog.opened = false);
        this.confirm = content.querySelector('#confirm');
        this.confirm.addEventListener('click', () => dialog.opened = false);
    }
}

customElements.define('confirm-dialog', ConfirmDialog);