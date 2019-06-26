class TrackData extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    private get buttonNode(): HTMLElement {
        const button = document.createElement('vaadin-button');
        button.innerHTML = '<iron-icon icon="vaadin:plus" slot="prefix"></iron-icon> Add to category';
        button.addEventListener('click', () => this.dispatchEvent(new Event('add')));
        return button;
    }

    private get effectsNode(): HTMLElement {
        const item = document.createElement('titled-item');
        item.title = 'Effects';
        item.innerHTML = this.innerHTML;
        return item;
    }

    private get frequencyNode(): HTMLElement {
        const trackType = this.getAttribute('track-type')!;
        let text = '';
        if (['pure', 'isochronic'].includes(trackType)) {
            text = `${this.getAttribute('hz')} Hz`;
        } else if (trackType === 'solfeggio') {
            const binaural = this.getAttribute('binaural-hz');
            const solfeggio = this.getAttribute('solfeggio-hz');
            text = `${binaural} Hz (${solfeggio} Hz Solfeggio)`;
        }
        const h2 = document.createElement('h2');
        h2.textContent = `Frequency: ${text}`;
        return h2;
    }

    private static createDiv(child: HTMLElement): HTMLElement {
        const div = document.createElement('div');
        div.className = 'block';
        div.appendChild(child);
        return div;
    }

    connectedCallback() {
        const layout = document.createElement('vaadin-vertical-layout');
        layout.appendChild(TrackData.createDiv(this.frequencyNode));
        if (this.children.length > 0) layout.appendChild(TrackData.createDiv(this.effectsNode));
        layout.appendChild(TrackData.createDiv(this.buttonNode));
        this.shadowRoot!.appendChild(layout);
    }
}

customElements.define('track-data', TrackData);