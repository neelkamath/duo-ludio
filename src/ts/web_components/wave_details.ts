class WaveDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    private static get summaryNode(): HTMLDivElement {
        const div = document.createElement('div');
        div.slot = 'summary';
        div.innerHTML = '<h1>Details</h1>';
        return div;
    }

    private get frequencyNode(): HTMLElement {
        const item = document.createElement('titled-item');
        item.title = 'Frequency Range';
        item.textContent = `${this.getAttribute('min')} Hz - ${this.getAttribute('max')} Hz`;
        return item;
    }

    private get explanationNode(): HTMLElement {
        const item = document.createElement('titled-item');
        item.title = 'Explanation';
        item.textContent = this.getAttribute('explanation');
        return item;
    }

    private get benefitsNode(): HTMLElement {
        const item = document.createElement('titled-item');
        item.title = 'Benefits';
        item.innerHTML = this.innerHTML;
        return item;
    }

    connectedCallback() {
        const details = document.createElement('vaadin-details');
        details.style.margin = '1em 0';
        details.appendChild(WaveDetails.summaryNode);
        details.appendChild(this.frequencyNode);
        details.appendChild(this.explanationNode);
        details.appendChild(this.benefitsNode);
        this.shadowRoot!.appendChild(details);
    }
}

customElements.define('wave-details', WaveDetails);