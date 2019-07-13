import {Howl} from 'howler';

export interface AudioData {
    /** Audio URL */
    src: string;
    /** File extension (e.g., `'aac'`, `'mp3'`) */
    format: string;
    /** The number of milliseconds at which the audio should start playing at */
    start: number;
    /** The number of milliseconds at which the audio should stop playing at */
    end: number;
    /** Whether audio is to loop infinitely */
    loop: boolean;
}

/** Delegating audio playback to this class ensures that only one audio plays at any given time. */
export class AudioPlayerElement extends HTMLElement {
    private sound: Howl | null = null;
    private soundId: number | null = null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /** If an audio is currently being played, it will be stopped. Then, `data` will be played. */
    play(data: AudioData): void {
        this.stop();
        // We have to use a sprite from howler.js because HTML media elements do not support gapless playback
        this.sound = new Howl({
            src: data.src,
            format: data.format,
            sprite: {beat: [data.start, data.end, data.loop]}
        });

        this.soundId = this.sound.play('beat');
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