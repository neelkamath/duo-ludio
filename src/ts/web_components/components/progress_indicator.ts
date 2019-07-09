// @ts-ignore: Missing module declaration
import {ProgressBarElement} from '@vaadin/vaadin-progress-bar/src/vaadin-progress-bar';

/**
 * This web component's HTML name is `progress-indicator`. It is an indeterminate progress bar with content explaining
 * what is progressing. Place the HTML content in between this element's HTML tags.
 *
 * Example: `<progress-indicator>Buffering...</progress-indicator>`
 */
export default class ProgressIndicatorElement extends HTMLElement {
    private connectedOnce = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        const item = document.createElement('vaadin-item');
        item.append(...this.childNodes);
        const progress = document.createElement('vaadin-progress-bar') as ProgressBarElement;
        progress.indeterminate = true;
        this.shadowRoot!.append(
            document.createElement('br'),
            item,
            progress,
            document.createElement('br')
        );
    }
}

customElements.define('progress-indicator', ProgressIndicatorElement);