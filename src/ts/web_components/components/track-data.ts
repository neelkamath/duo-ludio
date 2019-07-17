// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore: Missing module declaration
import {VerticalLayoutElement} from '@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout';
import TitledItemElement from './titled-item';

export interface SingleFrequencyTrack {
    /** Frequency in Hz */
    frequency: number;
}

export interface PureTrack extends SingleFrequencyTrack {
}

export interface IsochronicTrack extends SingleFrequencyTrack {
}

export interface SolfeggioTrack {
    /** Frequency in Hz */
    binauralBeatFrequency: number;
    /** Frequency in Hz */
    solfeggioFrequency: number;
}

/**
 * This web component has the HTML name `track-data`. It is meant for binaural beats. It displays a track's frequencies
 * and effects, with a button meant to save the track. If the track has effects to display, add the effects HTML between
 * this element's HTML tags. Call [[setTrack]] before the element is connected to the DOM.
 *
 * Example:
 * ```
 * <track-data id="track"><ul><li>Focusing</li></ul></track-data>
 * <script>document.querySelector('#track').setTrack({frequency: 8});</script>
 * ```
 */
export class TrackDataElement extends HTMLElement {
    private track!: PureTrack | IsochronicTrack | SolfeggioTrack;
    private readonly effects = document.createElement('titled-item') as TitledItemElement;
    private readonly layout: VerticalLayoutElement = document.createElement('vaadin-vertical-layout');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.effects.title = 'Effects';
    }

    /** @returns A `vaadin-vertical-layout` block containing `child` */
    private static getDiv(child: HTMLElement): HTMLDivElement {
        const div = document.createElement('div');
        div.className = 'block';
        div.append(child);
        return div;
    }

    /** Calling this more than once will throw an `Error` */
    setTrack(track: PureTrack | IsochronicTrack | SolfeggioTrack): void {
        if (this.track) throw new Error('Track already set');
        this.track = track;
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.effects.append(...this.childNodes);
        this.layout.append(TrackDataElement.getDiv(this.getFrequency()));
        if (this.effects) this.layout.append(TrackDataElement.getDiv(this.effects));
        this.layout.append(TrackDataElement.getDiv(this.getButton()));
        this.shadowRoot!.append(this.layout);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
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

    private getFrequency(): HTMLHeadingElement {
        let text = '';
        if ('solfeggioFrequency' in this.track) {
            text = `${this.track.binauralBeatFrequency} Hz (${this.track.solfeggioFrequency} Hz Solfeggio)`;
        } else {
            text = `${this.track.frequency} Hz`;
        }
        const h2 = document.createElement('h2');
        h2.textContent = `Frequency: ${text}`;
        return h2;
    }
}

customElements.define('track-data', TrackDataElement);