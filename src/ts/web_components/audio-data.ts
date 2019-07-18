export default interface AudioData {
    /** Audio URL */
    readonly src: string;
    /** File extension (e.g., `'aac'`, `'mp3'`) */
    readonly format: string;
    /** Duration in milliseconds */
    readonly duration: number;
}