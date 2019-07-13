import ProgressIndicatorElement from './progress_indicator';
import TitledItemElement from './titled_item';
import AudioControlElement from './audio_control';
import {AudioPlayerElement} from './audio_player';

/**
 * This web component's HTML name is `playable-track`. It contains a track's name, effects, and audio player. Place the
 * effects HTML in between this element's HTML tags. You must call [[displayDownloader]], [[displayControl]], or
 * [[displayOffline]] at least once. The audio will play in a gapless infinite loop by trimming the first and last
 * second of the audio. It will not be available via system controls since it does not make use of an HTML media
 * element. Assign [[player]] before this element is connected to the DOM.
 *
 * Example:
 * ```
 * <playable-track id="track" name="Alpha 8 Hz" src="Alpha_8_Hz.aac" format="aac" duration="5000">
 *     <ul><li>Focusing</li></ul>
 * </playable-track>
 * <script>
 *     const track = document.querySelector('#track');
 *     track.player
 *     track.displayControl();
 * </script>
 * ```
 * @attribute name (required) Track name (e.g., `'Alpha 10 Hz Isochronic Pulses'`)
 * @attribute src (required) Audio URL
 * @attribute format (required) Audio's file extension (e.g., `mp3`, `aac`)
 * @attribute duration (required) Audio's duration in milliseconds
 */
export class PlayableTrackElement extends HTMLElement {
    player = document.createElement('audio-player') as AudioPlayerElement;
    private connectedOnce = false;
    private readonly control = document.createElement('audio-control') as AudioControlElement;
    private readonly download = document.createElement('progress-indicator') as ProgressIndicatorElement;
    private readonly offline = document.createTextNode('The track cannot be downloaded since you are offline.');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.download.textContent = 'Downloading...';
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        this.setUpAudio();
        if (this.childNodes.length > 0) this.shadowRoot!.prepend(this.getEffects());
        const h2 = document.createElement('h2');
        h2.textContent = this.getAttribute('name');
        this.shadowRoot!.prepend(h2);
    }

    /** Displays the audio control */
    displayControl(): void {
        this.replaceAudioContent(this.control);
    }

    /** Displays the progress bar for downloading audio */
    displayDownloader(): void {
        this.replaceAudioContent(this.download);
    }

    private setUpAudio(): void {
        let selfSent = false;
        this.control.addEventListener('click', () => {
            selfSent = true;
            if (this.control.displaysStop) {
                this.player.stop()
            } else {
                this.player.play({
                    src: this.getAttribute('src')!,
                    format: this.getAttribute('format')!,
                    start: 1000,
                    end: parseFloat(this.getAttribute('duration')!) - 1000,
                    loop: true
                });
            }
            this.control.displaysStop = !this.control.displaysStop;
            selfSent = false;
        });
        this.player.addEventListener('stop', () => {
            if (!selfSent) this.control.displaysStop = false;
        });
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