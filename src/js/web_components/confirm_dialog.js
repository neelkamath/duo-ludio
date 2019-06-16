class ConfirmDialog extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.appendChild(ConfirmDialog._getTemplateContent().cloneNode(true));

        this.shadowRoot.querySelector('#title').textContent = this.getAttribute('title');
        this.shadowRoot.querySelector('#body').textContent = this.getAttribute('body');
        let cancelText = 'Cancel';
        if (this.hasAttribute('cancel')) cancelText = this.getAttribute('cancel');
        this.shadowRoot.querySelector('#cancel').textContent = cancelText;
        let confirmText = 'Confirm';
        if (this.hasAttribute('confirm')) confirmText = this.getAttribute('confirm');
        this.shadowRoot.querySelector('#confirm').textContent = confirmText;

        this.cancel = this.shadowRoot.querySelector('#cancel');
        this.confirm = this.shadowRoot.querySelector('#confirm');
    }

    static _getTemplateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <div><strong id="title"></strong></div>
            <br>
            <div id="body"></div>
            <div id="buttons">
                <vaadin-button id="cancel"></vaadin-button>
                <vaadin-button id="confirm"></vaadin-button>
            </div>
            
            <style>
                #buttons {
                    float: right;
                    margin-bottom: 1em;
                    margin-top: 1.5em;
                }
            </style>
        `;
        return template.content;
    }
}

customElements.define('confirm-dialog', ConfirmDialog);