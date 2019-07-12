// @ts-ignore: Missing module declaration
import AudioControlElement from './audio_control';
import {Howl} from 'howler';

export interface AudioData {
    audio: Blob,
    /** File extension (e.g., `'aac'`, `'mp3'`) */
    format: string,
    /** Duration */
    seconds: number
}

/**
 * This web component's HTML name is `audio-player`. It plays a single audio in an infinite loop. This element will
 * display nothing until [[play]] is called.
 *
 * Example:
 * ```
 * <audio-player id="player"></audio-player>
 * <script>
 *     fetch('super_mario.aac').then(async (response) => {
 *         const data = {audio: await response.blob(), format: 'aac', seconds: 5};
 *         document.querySelector('#player').play('Super Mario', data);
 *     });
 * </script>
 * ```
 */
export class AudioPlayerElement extends HTMLElement {
    private connectedOnce = false;
    private sound: Howl | null = null;
    private text = document.createTextNode('No tracks playing');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        const control = document.createElement('audio-control') as AudioControlElement;
        control.addEventListener('click', () => {
            if (this.sound) {
                control.displaysStop ? this.sound.stop() : this.sound.play('beat');
                control.displaysStop = !control.displaysStop;
            }
        });
        const item = document.createElement('vaadin-item');
        item.append(control, this.text);
        this.shadowRoot!.append(item);
    }

    /**
     * @param name Text to display
     * @param data Audio to play
     * @param gapless Whether the first and last second of audio should be trimmed to allow for gapless playback
     */
    play(name: string, data: AudioData, gapless = true): void {
        this.text.textContent = ` ${name}`;
        if (this.sound) this.sound.unload();
        const duration = data.seconds * 1000;

        // We have to use a sprite from howler.js because <HTMLAudioElement>s do not support gapless playback
        this.sound = new Howl({
            src: URL.createObjectURL(data.audio),
            format: data.format,
            sprite: {beat: [gapless ? 1000 : 0, gapless ? duration - 1000 : duration, true]}
        });
    }
}

customElements.define('audio-player', AudioPlayerElement);