class DialogButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const button = document.createElement('vaadin-button');
        button.innerHTML = this.innerHTML;
        button.style.cssFloat = 'right';
        button.style.margin = '1em 0';
        this.shadowRoot!.appendChild(button);
    }
}

customElements.define('dialog-button', DialogButton);