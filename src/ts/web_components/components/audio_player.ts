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
        const control = this.getControl();
        this.setUpAudio(control, blob);
        const item = document.createElement('vaadin-item');
        item.append(control, document.createTextNode(` ${name}`));
        this.shadowRoot!.append(item);
    }

    private setUpAudio(control: AudioControlElement, blob: Blob): void {
        this.audio.loop = true;
        this.audio.src = URL.createObjectURL(blob);
        this.audio.addEventListener('play', () => control.displaysPause = true);
        this.audio.addEventListener('pause', () => control.displaysPause = false);

        // Manipulate the audio so that it's at least five seconds long so it can be manipulated via native controls
        this.audio.addEventListener('loadedmetadata', () => {
            let duration = this.audio.duration;
            const parts = [blob];
            while (duration < 5) {
                parts.push(blob);
                duration += duration;
            }
            this.audio.src = URL.createObjectURL(new Blob(parts));
            this.audio.play();
        }, {once: true});
    }

    private getControl(): AudioControlElement {
        const control = document.createElement('audio-control') as AudioControlElement;
        control.displaysPause = true;
        control.addEventListener('click', () => {
            control.displaysPause ? this.audio.pause() : this.audio.play();
            control.displaysPause = !control.displaysPause;
        });
        return control;
    }
}

customElements.define('audio-player', AudioPlayerElement);