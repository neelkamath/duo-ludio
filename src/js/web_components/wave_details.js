class WaveDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
        this.benefits = this.shadowRoot.querySelector('#benefits-item').body;
    }

    get _templateContent() {
        let min = this.getAttribute('min-frequency');
        let max = this.getAttribute('max-frequency');
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-details id="details">
                <div slot="summary"><h1>Details</h1></div>
                <titled-item title="Frequency Range" body="${min} Hz - ${max} Hz"></titled-item>
                <titled-item 
                    title="Explanation" 
                    body="${this.getAttribute('explanation')}"
                ></titled-item>
                <titled-item id="benefits-item" title="Benefits" body=""></titled-item>
            </vaadin-details>
            
            <style>
                #details {
                    margin: 1em 0;
                }
            </style>
        `;
        return template.content;
    }
}

customElements.define('wave-details', WaveDetails);