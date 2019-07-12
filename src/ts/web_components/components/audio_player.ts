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
    private sound: Howl | null = null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /**
     * @param name Text to display
     * @param data Audio to play
     */
    play(name: string, data: AudioData): void {
        while (this.shadowRoot!.firstChild) this.shadowRoot!.removeChild(this.shadowRoot!.firstChild!);
        const item = document.createElement('vaadin-item');
        item.append(this.getControl(data), document.createTextNode(` ${name}`));
        this.shadowRoot!.append(item);
    }

    private getControl(data: AudioData): AudioControlElement {
        if (this.sound) this.sound.unload();
        const src = URL.createObjectURL(data.audio);
        this.sound = new Howl({src, format: data.format, sprite: {beat: [0, data.seconds * 1000, true]}});
        const control = document.createElement('audio-control') as AudioControlElement;
        control.addEventListener('click', () => {
            control.displaysStop ? this.sound!.stop() : this.sound!.play('beat');
            control.displaysStop = !control.displaysStop;
        });
        return control;
    }
}

customElements.define('audio-player', AudioPlayerElement);