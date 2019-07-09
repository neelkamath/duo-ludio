// @ts-ignore: Missing module declaration
import AudioControlElement from './audio_control';

/**
 * This web component's HTML name is `audio-player`. It plays a single audio in an infinite loop. This element will
 * display nothing until [[play]] is called.
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
    // A single audio reference is required to prevent playing multiple tracks at the same time.
    private readonly audio: HTMLAudioElement = document.createElement('audio');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /**
     * @param name Text to display
     * @param blob Audio to play
     */
    play(name: string, blob: Blob): void {
        while (this.shadowRoot!.firstChild) this.shadowRoot!.removeChild(this.shadowRoot!.firstChild!);
        this.audio.loop = true;
        this.audio.src = URL.createObjectURL(blob);
        const control = document.createElement('audio-control') as AudioControlElement;
        control.displaysPause = true;
        control.addEventListener('click', () => {
            control.displaysPause ? this.audio.pause() : this.audio.play();
            control.displaysPause = !control.displaysPause;
        });
        const item = document.createElement('vaadin-item');
        item.append(control, document.createTextNode(` ${name}`));
        this.shadowRoot!.append(item);
        this.audio.play();
    }
}

customElements.define('audio-player', AudioPlayerElement);