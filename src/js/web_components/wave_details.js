import * as utility from '../utility';

class WaveDetails extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let templateContent = document.querySelector('#wave-details-template').content;
        this.shadowRoot.appendChild(templateContent.cloneNode(true));

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
    }
}

customElements.define('wave-details', WaveDetails);