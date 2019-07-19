import {Howl} from 'howler';
import AudioData from '../audio-data';

/**
 * This web component's HTML name is `audio-player`. Delegating audio playback to this class ensures that only one audio
 * plays at any given time.
 *
 * Example:
 * ```
 * <audio-player id="player"></audio-player>
 * <script>
 *     document.querySelector('#player').play(
 *         {src: 'Alpha_8_Hz.mp3', format: 'aac', start: 1000, end: 4000, loop: true}
 *     );
 * </script>
 * ```
 */
export default class AudioPlayerElement extends HTMLElement {
    private sound: Howl | null = null;
    private soundId: number | null = null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /**
     * If an audio is currently being played, it will be stopped. Then, `data` will be played in an infinite loop. If
     * the audio is less than a minute in duration, its first and last seconds will be trimmed to allow for gapless
     * playback.
     */
    play(data: AudioData): void {
        this.stop();
        if (data.duration > 60 * 1000) { // Don't use sprites for long tracks as it wouldn't be performant otherwise.
            this.sound = new Howl({src: data.src, format: data.format, loop: true, html5: true});
            this.soundId = this.sound.play();
        } else {
            // We have to use a sprite from howler.js because HTML media elements do not support gapless playback.
            this.sound = new Howl({
                src: data.src,
                format: data.format,
                sprite: {beat: [1000, data.duration - 1000, true]}
            });
            this.soundId = this.sound.play('beat');
        }
    }

    /** If an audio is currently being played, it will be stopped. */
    stop(): void {
        if (this.sound && this.sound.playing(this.soundId!)) {
            this.dispatchStop();
            this.sound.stop();
        }
    }

    /**
     * Dispatches a `stop` `Event`
     *
     * Fired when an audio stops playing
     * @event
     */
    private dispatchStop(): void {
        this.dispatchEvent(new Event('stop'));
    }
}

customElements.define('audio-player', AudioPlayerElement);