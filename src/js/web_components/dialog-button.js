class DialogButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-button>${this.innerHTML}</vaadin-button>
            
            <style>
                #button {
                    float: right;
                    margin: 1em 0;
                }
            </style>
        `;
        return template.content;
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
    }
}

customElements.define('dialog-button', DialogButton);