// @ts-ignore: Missing module declaration
import {NotificationElement} from '@vaadin/vaadin-notification/src/vaadin-notification';
import ProgressIndicatorElement from './progress_indicator';
import TitledItemElement from './titled_item';
import AudioControlElement from './audio_control';
import AudioPlayer from '../../audio_player';

/**
 * This web component's HTML name is `playable-track`. It contains a track's name, effects, and audio player. The track
 * will loop infinitely while playing. Place the effects HTML in between this element's HTML tags. Set the instance
 * variables [[player]] and [[source]] ASAP. You must call [[displayDownloader]], [[displayControl]], or
 * [[displayOffline]] at least once.
 *
 * Example:
 * ```
 * <playable-track id="track" name="Alpha 8 Hz.mp3"><ul><li>Focusing</li></ul></playable-track>
 * <script>
 *     const track = document.querySelector('#track');
 *     fetch('Alpha_8_Hz.mp3').then((response) => response.arrayBuffer().then((buffer) => track.source = buffer));
 *     track.player = new AudioPlayer();
 *     track.displayControl();
 * </script>
 * ```
 * @attribute name (required) Track name (e.g., `'Alpha 10 Hz Isochronic Pulses'`)
 */
export default class PlayableTrackElement extends HTMLElement {
    player!: AudioPlayer;
    source!: ArrayBuffer;
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
        await this.setUpControl();
        if (this.childNodes.length > 0) this.shadowRoot!.prepend(this.getEffects());
        const h2 = document.createElement('h2');
        h2.textContent = this.getAttribute('name');
        this.shadowRoot!.prepend(h2);
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

    private async setUpControl(): Promise<void> {
        let selfSentStop = false;
        let loading = false;
        this.control.addEventListener('click', async () => {
            if (loading) return;
            loading = true;
            if (this.control.displaysStop) {
                this.player.isProcessing() ? this.displayProcessing() : await this.play();
            } else {
                selfSentStop = true;
                this.player.stop();
                selfSentStop = false;
                this.control.displaysStop = true;
            }
            loading = false;
        });
        document.addEventListener('audio-player-stop', () => {
            if (selfSentStop) return;
            this.control.displaysStop = true;
        });
    }

    /** Displays a notification stating that the track cannot be played currently because another is being processed */
    private displayProcessing(): void {
        const notification = document.createElement('vaadin-notification') as NotificationElement;
        notification.position = 'bottom-stretch';
        notification.duration = 3000;
        notification.renderer = (root: HTMLElement) => {
            root.append(document.createTextNode('Please wait for the current track to buffer'));
        };
        notification.open();
        this.shadowRoot!.append(notification);
    }

    /** Plays the audio, displaying a buffering progress bar if required */
    private async play(): Promise<void> {
        const start = async () => await this.player.start(this.source.slice(0));
        if (this.source.byteLength > 1e6) {
            const buffer = document.createElement('progress-indicator');
            buffer.textContent = 'Buffering...';
            this.shadowRoot!.append(buffer);
            await start();
            this.shadowRoot!.removeChild(buffer);
        } else {
            await start();
        }
        this.control.displaysStop = false;
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