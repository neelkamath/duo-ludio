import TitledItemElement from './titled_item';

/**
 * This web component's HTML name is `audio-player`. It plays a single audio in an infinite loop.
 *
 * Example:
 * ```
 * <audio-player id="player"></audio-player>
 * <script>
 *     fetch('super_mario.mp3').then(async (response) => {
 *         document.querySelector('#player').play('Super Mario', await response.blob());
 *     });
 * </script>
 * ```
 */
export default class AudioPlayerElement extends HTMLElement {
    private connectedOnce = false;
    private readonly item = document.createElement('titled-item') as TitledItemElement;
    private readonly audio: HTMLAudioElement = document.createElement('audio');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.item.title = 'No tracks playing';
        this.item.append(this.audio);
        this.audio.setAttribute('controls', 'controls');
        this.audio.loop = true;
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        this.shadowRoot!.append(this.item);
    }

    /**
     * This function sets up the audio element. The user must hit the play button themselves because Safari blocks it
     * otherwise.
     * @param name Text to display
     * @param blob Audio to play
     * @param type `blob`'s type
     */
    play(name: string, blob: Blob, type: string = 'audio/mpeg'): void {
        this.item.title = name;
        this.audio.src = URL.createObjectURL(blob);

        // Manipulate the audio so that it's at least five seconds long so it can be manipulated via native controls
        this.audio.addEventListener('loadedmetadata', () => {
            let duration = this.audio.duration;
            const parts = [blob];
            while (duration < 5) {
                parts.push(blob);
                duration += duration;
            }
            this.audio.src = URL.createObjectURL(new Blob(parts, {type}));
        }, {once: true});
    }
}

customElements.define('audio-player', AudioPlayerElement);