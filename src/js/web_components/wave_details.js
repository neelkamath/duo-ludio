import * as utility from '../utility';

class WaveDetails extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-details id="details">
                <div slot="summary"><h1>Details</h1></div>
                <span id="frequency-range"></span>
                <span id="explanation"></span>
                <span id="benefits"></span>
            </vaadin-details>
            
            <style>
                #details {
                    margin: 1em 0;
                }
            </style>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        let min = this.getAttribute('min-frequency');
        let max = this.getAttribute('max-frequency');
        this.shadowRoot.querySelector('#frequency-range').innerHTML = `
            <titled-item title="Frequency Range" body="${min} Hz - ${max} Hz"></titled-item>
        `;
        let explanation = utility.escapeHTML(this.getAttribute('explanation'));
        this.shadowRoot.querySelector('#explanation').innerHTML = `
            <titled-item title="Explanation" body="${explanation}"></titled-item>
        `;
        this.shadowRoot.querySelector('#benefits').innerHTML = `
            <titled-item id="benefits-item" title="Benefits" body=""></titled-item>
        `;

        this.benefits = this.shadowRoot.querySelector('#benefits-item').body;
    }
}

customElements.define('wave-details', WaveDetails);