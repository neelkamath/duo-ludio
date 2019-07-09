import ProgressIndicatorElement from './progress_indicator';
import TitledItemElement from './titled_item';
import AudioControlElement from './audio_control';

/**
 * This web component's HTML name is `playable-track`. It contains a track's name, effects, and audio player. Place the
 * effects HTML in between this element's HTML tags. You must call [[displayDownloader]], [[displayControl]], or
 * [[displayOffline]] at least once.
 *
 * Example:
 * ```
 * <playable-track id="track" name="Alpha 8 Hz.mp3"><ul><li>Focusing</li></ul></playable-track>
 * <script>
 *     const track = document.querySelector('#track');
 *     track.displayControl();
 *     track.addEventListener('play', () => console.log('Cue mixtape'));
 * </script>
 * ```
 * @attribute name (required) Track name (e.g., `'Alpha 10 Hz Isochronic Pulses'`)
 */
export default class PlayableTrackElement extends HTMLElement {
    private connectedOnce = false;
    private readonly control = document.createElement('audio-control') as AudioControlElement;
    private readonly download = document.createElement('progress-indicator') as ProgressIndicatorElement;
    private readonly offline: Text = document.createTextNode(
        'The track cannot be downloaded since you are offline.'
    );

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.download.textContent = 'Downloading...';
    }

    async connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        this.control.addEventListener('click', () => this.dispatchPlay());
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

    /**
     * This displays the audio control. It will display a progress bar while the audio buffers (i.e., the duration
     * between the user clicking the play button, and the track playing).
     */
    displayControl(): void {
        this.replaceAudioContent(this.control);
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
        if (this.hasChild(this.control)) this.shadowRoot!.removeChild(this.control);
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