import 'regenerator-runtime/runtime';

/** Delegating track playback to this audio player ensures that only one track is ever playing at a time. */
export default class {
    private source: AudioBufferSourceNode | null = null;
    private isPlaying = false;
    private processing = false;

    /**
     * Checks whether a track is currently being processed to play (i.e., [[start]] was called with a sizeable track,
     * and is still executing)
     * @returns Whether [[start]] can be safely called
     */
    isProcessing(): boolean {
        return this.processing;
    }

    /** Stops the currently playing track */
    stop(): void {
        if (this.isPlaying) {
            this.source!.stop(0);
            this.isPlaying = false;
            this.dispatchStop();
            this.source!.disconnect();
        }
    }

    /**
     * It is assumed that you have checked if it is safe to call this function using [[isProcessing]]. The average
     * browser will execute this for around 3 seconds for a 15 minute MP3.
     * @param buffer Track to play in an infinite loop after stopping the currently track
     */
    async start(buffer: ArrayBuffer): Promise<void> {
        this.processing = true;
        this.stop();
        // @ts-ignore: Cannot use `new` when lacking call signature
        const context = new (window.AudioContext || window.webkitAudioContext)();
        this.source = context.createBufferSource();
        this.source!.buffer = await await this.decodeAudioData(context, buffer);
        this.source!.loop = true;
        this.source!.connect(context.destination);
        this.source!.start(0);
        this.isPlaying = true;
        this.processing = false;
    }

    /** Promisifies `baseAudioContext.decodeAudioData` since Safari doesn't support the promise-based syntax for it */
    private decodeAudioData(context: AudioContext, buffer: ArrayBuffer): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => context.decodeAudioData(buffer, resolve, reject));
    }

    /**
     * Dispatches an `audio-player-stop` `Event` to `document`
     *
     * Fired when a track is stopped
     * @event
     */
    private dispatchStop(): void {
        document.dispatchEvent(new Event('audio-player-stop'));
    }
}