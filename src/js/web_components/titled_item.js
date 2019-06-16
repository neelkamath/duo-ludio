class TitledItem extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-item>
                <div><strong id="title"></strong></div>
                <div id="body"></div>
            </vaadin-item>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector('#title').textContent = this.getAttribute('title');
        this.shadowRoot.querySelector('#body').innerHTML = this.getAttribute('body');

        this.body = this.shadowRoot.querySelector('#body');
    }
}

customElements.define('titled-item', TitledItem);