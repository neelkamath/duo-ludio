/** Delegating track playback to this audio player ensures that only one track is every playing at a time. */
export default class {
    private audio = new Audio();

    pause(): void {
        this.audio.pause();
    }

    /** Plays `track` after pausing the currently playing track */
    play(track: HTMLAudioElement): void {
        this.pause();
        this.audio = track;
        this.audio.play().catch(({message}) => console.error(message));
    }
}