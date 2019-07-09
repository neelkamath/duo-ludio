// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
import TitledItemElement from './titled_item';

/**
 * This web component has the HTML name `track-data`. It displays a track's frequencies and effects, with a button meant
 * to save the track. If the track has effects to display, add the effects HTML between this element's HTML tags.
 *
 * Example: `<track-data track-type="pure" hz="8"><ul><li>Focusing</li></ul></track-data>`
 * @attribute `track-type` (required) Either `pure`, `isochronic`, or `solfeggio` (e.g., `solfeggio`)
 * @attribute `hz` (required if the attribute `track-type` has the value `pure`) Track's frequency in Hz (e.g., `8`)
 * @attribute `binaural-hz` (required if the attribute `track-type` has the value `solfeggio`) The binaural beats'
 * frequency in Hz (e.g., `12`)
 * @attribute `solfeggio-hz` (required if the attribute `track-type` has the value `solfeggio`) The solfeggio's
 * frequency in Hz (e.g., `396`)
 */
export default class TrackDataElement extends HTMLElement {
    private connectedOnce = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /** @returns A `vaadin-vertical-layout` block containing `child` */
    private static getDiv(child: HTMLElement): HTMLDivElement {
        const div = document.createElement('div');
        div.className = 'block';
        div.append(child);
        return div;
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        const layout = document.createElement('vaadin-vertical-layout');
        layout.append(TrackDataElement.getDiv(this.getFrequency()));
        if (this.childNodes.length > 0) layout.append(TrackDataElement.getDiv(this.getEffects()));
        layout.append(TrackDataElement.getDiv(this.getButton()));
        this.shadowRoot!.append(layout);
    }

    /**
     * Dispatches the `add` `Event`
     *
     * Fired when the button is clicked
     * @event
     */
    private dispatchAdd(): void {
        this.dispatchEvent(new Event('add'));
    }

    private getButton(): ButtonElement {
        const button = document.createElement('vaadin-button');
        button.innerHTML = '<iron-icon icon="vaadin:plus" slot="prefix"></iron-icon> Add to category';
        button.addEventListener('click', () => this.dispatchAdd());
        return button;
    }

    /** @returns Effects, assuming they're present */
    private getEffects(): TitledItemElement {
        const item = document.createElement('titled-item') as TitledItemElement;
        item.title = 'Effects';
        item.append(...this.childNodes);
        return item;
    }

    private getFrequency(): HTMLHeadingElement {
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
}

customElements.define('track-data', TrackDataElement);