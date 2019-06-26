class TrackData extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get _buttonNode() {
        let button = document.createElement('vaadin-button');
        button.innerHTML = '<iron-icon icon="vaadin:plus" slot="prefix"></iron-icon> Add to category';
        button.addEventListener('click', () => this.dispatchEvent(new Event('add')));
        return button;
    }

    get _effectsNode() {
        let item = document.createElement('titled-item');
        item.title = 'Effects';
        item.innerHTML = this.innerHTML;
        return item;
    }

    get _frequencyNode() {
        let trackType: string = this.getAttribute('track-type')!;
        let text = '';
        if (['pure', 'isochronic'].includes(trackType)) {
            text = `${this.getAttribute('hz')} Hz`;
        } else if (trackType === 'solfeggio') {
            let binaural = this.getAttribute('binaural-hz');
            let solfeggio = this.getAttribute('solfeggio-hz');
            text = `${binaural} Hz (${solfeggio} Hz Solfeggio)`;
        }
        let h2 = document.createElement('h2');
        h2.textContent = `Frequency: ${text}`;
        return h2;
    }

    static _createDiv(child) {
        let div: any = document.createElement('div');
        div.class = 'block';
        div.appendChild(child);
        return div;
    }

    connectedCallback() {
        let layout = document.createElement('vaadin-vertical-layout');
        layout.appendChild(TrackData._createDiv(this._frequencyNode));
        if (this.children.length > 0) layout.appendChild(TrackData._createDiv(this._effectsNode));
        layout.appendChild(TrackData._createDiv(this._buttonNode));
        this.shadowRoot!.appendChild(layout);
    }
}

customElements.define('track-data', TrackData);