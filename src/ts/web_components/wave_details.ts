class WaveDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static get _summaryNode() {
        let div = document.createElement('div');
        div.slot = 'summary';
        div.innerHTML = '<h1>Details</h1>';
        return div;
    }

    get _frequencyNode() {
        let item = document.createElement('titled-item');
        item.title = 'Frequency Range';
        item.textContent = `${this.getAttribute('min')} Hz - ${this.getAttribute('max')} Hz`;
        return item;
    }

    get _explanationNode() {
        let item = document.createElement('titled-item');
        item.title = 'Explanation';
        item.textContent = this.getAttribute('explanation');
        return item;
    }

    get _benefitsNode() {
        let item = document.createElement('titled-item');
        item.title = 'Benefits';
        item.innerHTML = this.innerHTML;
        return item;
    }

    connectedCallback() {
        let details = document.createElement('vaadin-details');
        details.style.margin = '1em 0';
        details.appendChild(WaveDetails._summaryNode);
        details.appendChild(this._frequencyNode);
        details.appendChild(this._explanationNode);
        details.appendChild(this._benefitsNode);
        this.shadowRoot!.appendChild(details);
    }
}

customElements.define('wave-details', WaveDetails);