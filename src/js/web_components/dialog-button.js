class DialogButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
        this.button = this.shadowRoot.querySelector('#button');
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-button id="button">${this.textContent}</vaadin-button>
            
            <style>
                #button {
                    float: right;
                    margin: 1em 0;
                }
            </style>
        `;
        return template.content;
    }
}

customElements.define('dialog-button', DialogButton);