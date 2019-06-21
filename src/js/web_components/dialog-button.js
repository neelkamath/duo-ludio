class DialogButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-button id="button">${this.innerHTML}</vaadin-button>
            <style>
                #button {
                    float: right;
                    margin: 1em 0;
                }
            </style>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('dialog-button', DialogButton);