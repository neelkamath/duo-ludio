import * as utility from '../utility';

class WaveDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-details id="details">
                <div slot="summary"><h1>Details</h1></div>
                <titled-item title="Frequency Range">
                    ${utility.getAttribute(this, 'min')} Hz - ${utility.getAttribute(this, 'max')} Hz
                </titled-item>
                <titled-item title="Explanation">${utility.getAttribute(this, 'explanation')}</titled-item>
                <titled-item title="Benefits">${this.innerHTML}</titled-item>
            </vaadin-details>
            <style>
                #details {
                    margin: 1em 0;
                }
            </style>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('wave-details', WaveDetails);