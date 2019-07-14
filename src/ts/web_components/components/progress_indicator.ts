// @ts-ignore: Missing module declaration
import {ItemElement} from '@vaadin/vaadin-item/src/vaadin-item';
// @ts-ignore: Missing module declaration
import {ProgressBarElement} from '@vaadin/vaadin-progress-bar/src/vaadin-progress-bar';

/**
 * This web component's HTML name is `progress-indicator`. It is an indeterminate progress bar with content explaining
 * what is progressing.
 *
 * Example: `<progress-indicator text="Buffering..."></progress-indicator>`
 */
export default class ProgressIndicatorElement extends HTMLElement {
    private readonly item: ItemElement = document.createElement('vaadin-item');
    private readonly progress = document.createElement('vaadin-progress-bar') as ProgressBarElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.progress.indeterminate = true;
    }

    static get observedAttributes() {
        return ['text'];
    }

    get text(): string {
        return this.getAttribute('text')!;
    }

    set text(value: string) {
        this.setAttribute('text', value);
    }

    // @ts-ignore: Variable declared but not used
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'text') this.updateText();
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.updateText();
        this.shadowRoot!.append(this.item, this.progress);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
    }

    private updateText(): void {
        this.item.textContent = this.text;
    }
}

customElements.define('progress-indicator', ProgressIndicatorElement);