class OKDialog extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let template = document.createElement('template');
        template.innerHTML = `
            <div id="message"></div>
            <vaadin-button id="ok">OK</vaadin-button>
            
            <style>
                #ok {
                    float: right;
                    margin-bottom: 1em;
                    margin-top: 1.5em;
                }
            </style>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector('#message').textContent = this.getAttribute('message');

        this.button = this.shadowRoot.querySelector('#ok');
    }
}

customElements.define('ok-dialog', OKDialog);