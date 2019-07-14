export default interface AudioData {
    /** Audio URL */
    readonly src: string;
    /** File extension (e.g., `'aac'`, `'mp3'`) */
    readonly format: string;
    /** The number of milliseconds at which the audio should start playing at */
    readonly start: number;
    /** The number of milliseconds at which the audio should stop playing at */
    readonly end: number;
    /** Whether the audio is to loop infinitely */
    readonly loop: boolean;
}