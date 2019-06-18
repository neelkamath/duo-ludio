class WaveDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-details id="details">
                <div slot="summary"><h1>Details</h1></div>
                <titled-item title="Frequency Range">
                    ${this.getAttribute('min')} Hz - ${this.getAttribute('max')} Hz
                </titled-item>
                <titled-item title="Explanation">${this.getAttribute('explanation')}</titled-item>
                <titled-item title="Benefits">${this.innerHTML}</titled-item>
            </vaadin-details>
            
            <style>
                #details {
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

customElements.define('wave-details', WaveDetails);