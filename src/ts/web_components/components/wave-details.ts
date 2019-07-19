// @ts-ignore: Missing module declaration
import {DetailsElement} from '@vaadin/vaadin-details/src/vaadin-details';
import TitledItemElement from './titled-item';

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
    private readonly frequency = document.createElement('titled-item') as TitledItemElement;
    private readonly explanationElement = document.createElement('titled-item') as TitledItemElement;
    private readonly details: DetailsElement = document.createElement('vaadin-details');
    private readonly benefits = document.createElement('titled-item') as TitledItemElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.frequency.title = 'Frequency Range';
        this.explanationElement.title = 'Explanation';
        this.details.style.margin = '1em 0';
        this.details.append(WaveDetailsElement.getSummary(), this.frequency, this.explanationElement, this.benefits);
        this.benefits.title = 'Benefits';
    }

    static get observedAttributes() {
        return ['min', 'max', 'explanation'];
    }

    get min(): number {
        return parseFloat(this.getAttribute('min')!);
    }

    set min(value: number) {
        this.setAttribute('min', value.toString());
    }

    get max(): number {
        return parseFloat(this.getAttribute('max')!);
    }

    set max(value: number) {
        this.setAttribute('max', value.toString());
    }

    get explanation(): string {
        return this.getAttribute('explanation')!;
    }

    set explanation(value: string) {
        this.setAttribute('explanation', value);
    }

    private static getSummary(): HTMLDivElement {
        const div = document.createElement('div');
        div.slot = 'summary';
        div.innerHTML = '<h1>Details</h1>';
        return div;
    }

    // @ts-ignore: Variable declared but never read
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'min':
            case 'max':
                this.updateFrequency();
                break;
            case 'explanation':
                this.updateExplanation();
        }
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.benefits.append(...this.childNodes);
        this.updateFrequency();
        this.updateExplanation();
        this.shadowRoot!.append(this.details);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
    }

    /** Updates element to reflect the `min` and `max` attributes */
    private updateFrequency(): void {
        this.frequency.textContent = `${this.min} Hz - ${this.max} Hz`;
    }

    private updateExplanation(): void {
        this.explanationElement.textContent = this.explanation;
    }
}

customElements.define('wave-details', WaveDetailsElement);