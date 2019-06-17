class OKDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
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

    render(message) {
        let dialog = this.shadowRoot.querySelector('#dialog');
        dialog.renderer = (root) => root.innerHTML = `
            <span id="content">
                <div>${message}</div>
                <dialog-button id="button">OK</dialog-button>
            </span>
        `;
        dialog.opened = true;
        let content = document.querySelector('#content');
        content.querySelector('#button').addEventListener('click', () => dialog.opened = false);
    }
}

customElements.define('ok-dialog', OKDialog);