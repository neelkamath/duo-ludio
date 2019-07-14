import ProgressIndicatorElement from './progress_indicator';
import TitledItemElement from './titled_item';
import AudioControlElement from './audio_control';
import AudioPlayerElement from './audio_player';
import AudioData from '../audio_data';

/**
 * This web component's HTML name is `playable-track`. It contains a track's name, effects, and audio player. Place the
 * effects HTML in between this element's HTML tags. You must call [[displayDownloader]], [[displayControl]], or
 * [[displayOffline]] at least once. It will not be available via system controls since it does not make use of an HTML
 * media element. Call [[setPlayer]] and [[setSound]] before this element is connected to the DOM.
 *
 * Example:
 * ```
 * <playable-track id="track" name="Alpha 8 Hz"><ul><li>Focusing</li></ul></playable-track>
 * <script>
 *     const track = document.querySelector('#track');
 *     track.setPlayer(document.createElement('audio-player'));
 *     track.setSound({src: 'Alpha_8_Hz.aac', format: 'aac', start: 1000, end: 4000, loop: true});
 *     track.displayControl();
 * </script>
 * ```
 * @attribute name (required) Track name (e.g., `Alpha 10 Hz Isochronic Pulses`)
 */
export default class PlayableTrackElement extends HTMLElement {
    private player!: AudioPlayerElement;
    private sound!: AudioData;
    private readonly nameElement: HTMLHeadingElement = document.createElement('h2');
    private effects = document.createElement('titled-item') as TitledItemElement;
    private readonly control = document.createElement('audio-control') as AudioControlElement;
    private readonly download = document.createElement('progress-indicator') as ProgressIndicatorElement;
    private readonly offline = document.createTextNode('The track cannot be downloaded since you are offline.');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.effects.title = 'Effects';
        this.download.text = 'Downloading...';
    }

    static get observedAttributes() {
        return ['name'];
    }

    get name(): string {
        return this.getAttribute('name')!;
    }

    set name(value: string) {
        this.setAttribute('name', value);
    }

    // @ts-ignore: Variable declared but never read
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'name') this.updateName();
    }

    /** Calling this more than once will throw an `Error` */
    setPlayer(player: AudioPlayerElement): void {
        if (this.player) throw new Error('Audio player already set');
        this.player = player;
    }

    /** Calling this more than once will throw an `Error` */
    setSound(sound: AudioData): void {
        if (this.sound) throw new Error('Sound already set');
        this.sound = sound;
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.effects.append(...this.childNodes);
        this.setUpAudio();
        this.updateName();
        if (this.effects) this.shadowRoot!.prepend(this.effects);
        this.shadowRoot!.prepend(this.nameElement);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) child.remove();
    }

    private updateName(): void {
        this.nameElement.textContent = this.name;
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
        this.control.addEventListener('click', () => {
            if (this.control.stop) {
                this.player.stop();
            } else {
                this.player.play(this.sound);
                this.control.stop = true;
            }
        });
        this.player.addEventListener('stop', () => this.control.stop = false);
    }

    /** Displays that the track cannot be currently downloaded */
    displayOffline(): void {
        this.replaceAudioContent(this.offline);
    }

    private replaceAudioContent(child: ChildNode): void {
        if (this.hasChild(this.control)) this.control.remove();
        if (this.hasChild(this.download)) this.download.remove();
        if (this.hasChild(this.offline)) this.offline.remove();
        this.shadowRoot!.append(child);
    }

    /** @returns Whether `child` is in the shadow root */
    private hasChild(child: ChildNode): boolean {
        for (const node of this.shadowRoot!.childNodes) if (node === child) return true;
        return false;
    }
}

customElements.define('playable-track', PlayableTrackElement);