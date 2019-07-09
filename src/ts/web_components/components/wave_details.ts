import TitledItemElement from './titled_item';

/**
 * This web component's HTML name is `wave-details`. It contains an expandable item describing a wave (e.g., alpha
 * wave). When expanded, it shows the wave's range, explanation, and benefits. Place the benefits HTML in between this
 * element's HTML tags.
 *
 * Example:
 * ```
 * <wave-details
 *         explanation="This is the &quot;safest&quot; brainwave, and it increasing it can feel awesome!"
 *         id="alpha"
 *         max="12"
 *         min="8"
 * >
 *     <ul><li>Peak performance</li></ul>
 * </wave-details>
 * ```
 * @attribute `min` (required) Minimum frequency of wave in Hz (e.g., `8`)
 * @attribute `max` (required) Maximum frequency of wave in Hz (e.g., `12`)
 * @attribute `explanation` (required) Explanation of what the wave does (e.g.,
 * `This is the &quot;safest&quot; brainwave, and increasing it can feel awesome!`)
 */
export default class WaveDetailsElement extends HTMLElement {
    private connectedOnce = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    private static getSummary(): HTMLDivElement {
        const div = document.createElement('div');
        div.slot = 'summary';
        div.innerHTML = '<h1>Details</h1>';
        return div;
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        const details = document.createElement('vaadin-details');
        details.style.margin = '1em 0';
        details.append(WaveDetailsElement.getSummary(), this.getFrequency(), this.getExplanation(), this.getBenefits());
        this.shadowRoot!.append(details);
    }

    private getFrequency(): TitledItemElement {
        const item = document.createElement('titled-item') as TitledItemElement;
        item.title = 'Frequency Range';
        item.textContent = `${this.getAttribute('min')} Hz - ${this.getAttribute('max')} Hz`;
        return item;
    }

    private getExplanation(): TitledItemElement {
        const item = document.createElement('titled-item') as TitledItemElement;
        item.title = 'Explanation';
        item.textContent = this.getAttribute('explanation');
        return item;
    }

    private getBenefits(): TitledItemElement {
        const item = document.createElement('titled-item') as TitledItemElement;
        item.title = 'Benefits';
        item.append(...this.childNodes);
        return item;
    }
}

customElements.define('wave-details', WaveDetailsElement);