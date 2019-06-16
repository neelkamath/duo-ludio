class TabIcon extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let template = document.createElement('template');
        template.innerHTML = `
            <img 
                alt="${this.getAttribute('alt')}" 
                src="${this.getAttribute('src')}"
                style="height: 24px; width: 24px;"
            >
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

}

customElements.define('tab-icon', TabIcon);