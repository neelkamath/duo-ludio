// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
import ProgressIndicatorElement from './progress_indicator';
import TitledItemElement from './titled_item';

/**
 * This web component's HTML name is `playable-track`. It contains a track's name, effects, and audio player. Place the
 * effects HTML in between this element's HTML tags. You must call [[displayDownloader]], [[displayAdder]], or
 * [[displayOffline]] at least once.
 *
 * Example:
 * ```
 * <playable-track id="track" name="Alpha 8 Hz.aac"><ul><li>Focusing</li></ul></playable-track>
 * <script>
 *     const track = document.querySelector('#track');
 *     track.displayAdder();
 *     track.addEventListener('play', () => console.log('Cue mixtape'));
 * </script>
 * ```
 * @attribute name (required) Track name (e.g., `'Alpha 10 Hz Isochronic Pulses'`)
 */
export default class PlayableTrackElement extends HTMLElement {
    private connectedOnce = false;
    private readonly adder: ButtonElement = document.createElement('vaadin-button');
    private readonly download = document.createElement('progress-indicator') as ProgressIndicatorElement;
    private readonly offline = document.createTextNode('The track cannot be downloaded since you are offline.');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.adder.textContent = 'Add to audio player';
        this.download.textContent = 'Downloading...';
    }

    async connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        this.adder.addEventListener('click', () => this.dispatchPlay());
        if (this.childNodes.length > 0) this.shadowRoot!.prepend(this.getEffects());
        const h2 = document.createElement('h2');
        h2.textContent = this.getAttribute('name');
        this.shadowRoot!.prepend(h2);
    }

    /**
     * Dispatches a `play` `Event`
     *
     * Fired when the track is to be played
     * @event
     */
    private dispatchPlay(): void {
        this.dispatchEvent(new Event('play'));
    }

    /** Displays the progress bar for downloading audio */
    displayDownloader(): void {
        this.replaceAudioContent(this.download);
    }

    /** Displays the button to add the track (but not play it) to audio player */
    displayAdder(): void {
        this.replaceAudioContent(this.adder);
    }

    /** Displays that the track cannot be currently downloaded */
    displayOffline(): void {
        this.replaceAudioContent(this.offline);
    }

    /** @returns Effects, assuming they're present */
    private getEffects(): TitledItemElement {
        const item = document.createElement('titled-item') as TitledItemElement;
        item.title = 'Effects';
        item.append(...this.childNodes);
        return item;
    }

    private replaceAudioContent(child: ChildNode): void {
        if (this.hasChild(this.adder)) this.shadowRoot!.removeChild(this.adder);
        if (this.hasChild(this.download)) this.shadowRoot!.removeChild(this.download);
        if (this.hasChild(this.offline)) this.shadowRoot!.removeChild(this.offline);
        this.shadowRoot!.append(child);
    }

    /** @returns Whether `child` is in the shadow root */
    private hasChild(child: ChildNode): boolean {
        for (const node of this.shadowRoot!.childNodes) if (node === child) return true;
        return false;
    }
}

customElements.define('playable-track', PlayableTrackElement);