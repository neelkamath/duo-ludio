class TrackData extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static get _addButton() {
        return `
            <vaadin-button id="button">
                <iron-icon icon="vaadin:plus" slot="prefix"></iron-icon> 
                Add to category
            </vaadin-button>
        `;
    }

    get _templateContent() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-vertical-layout>
                <div class="block">${this._frequency}</div>
                <div class="block">
                    ${this.children.length > 0 ? `<titled-item title="Effects">${this.innerHTML}</titled-item>` : ''}
                </div>
                <div class="block">${this._addButton}</div>
            </vaadin-vertical-layout>
        `;
        return template.content;
    }

    get _frequency() {
        let trackType = this.getAttribute('track-type');
        let text = '';
        if (trackType === 'pure' || trackType === 'isochronic') {
            text = `${this.getAttribute('hz')} Hz`;
        } else if (trackType === 'solfeggio') {
            let binaural = this.getAttribute('binaural-hz');
            let solfeggio = this.getAttribute('solfeggio-hz');
            text = `${binaural} Hz (${solfeggio} Hz Solfeggio)`;
        }
        return `<h2>Frequency: ${text}</h2>`;
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this._templateContent.cloneNode(true));
        this.button = this.shadowRoot.querySelector('#button');
    }
}

customElements.define('track-data', TrackData);