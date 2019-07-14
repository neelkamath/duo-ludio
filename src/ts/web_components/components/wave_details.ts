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
    private readonly frequency = document.createElement('titled-item') as TitledItemElement;
    private readonly explanationElement = document.createElement('titled-item') as TitledItemElement;
    private benefits: TitledItemElement | null = null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.frequency.title = 'Frequency Range';
        this.explanationElement.title = 'Explanation';
    }

    static get observedAttributes() {
        return ['min', 'max', 'explanation'];
    }

    get min(): number {
        return parseFloat(this.getAttribute('min')!);
    }

    set min(value: number) {
        this.setAttribute('min', value.toString());
        this.updateFrequency();
    }

    get max(): number {
        return parseFloat(this.getAttribute('max')!);
    }

    set max(value: number) {
        this.setAttribute('max', value.toString());
        this.updateFrequency();
    }

    get explanation(): string {
        return this.getAttribute('explanation')!;
    }

    set explanation(value: string) {
        this.setAttribute('explanation', value);
        this.updateExplanation();
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

    private static getSummary(): HTMLDivElement {
        const div = document.createElement('div');
        div.slot = 'summary';
        div.innerHTML = '<h1>Details</h1>';
        return div;
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.setUpBenefits();
        this.updateFrequency();
        this.updateExplanation();
        const details = document.createElement('vaadin-details');
        details.style.margin = '1em 0';
        details.append(WaveDetailsElement.getSummary(), this.frequency, this.explanationElement, this.benefits!);
        this.shadowRoot!.append(details);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) this.shadowRoot!.removeChild(child);
    }

    /** Updates element to reflect the `min` and `max` attributes */
    private updateFrequency(): void {
        this.frequency.textContent = `${this.min} Hz - ${this.max} Hz`;
    }

    private updateExplanation(): void {
        this.explanationElement.textContent = this.explanation;
    }

    private setUpBenefits(): void {
        if (!this.benefits) {
            this.benefits = document.createElement('titled-item') as TitledItemElement;
            this.benefits.title = 'Benefits';
            this.benefits.append(...this.childNodes);
        }
    }
}

customElements.define('wave-details', WaveDetailsElement);