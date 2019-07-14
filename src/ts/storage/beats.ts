/**
 * This is the abstraction layer for dealing with binaural beats. A "track" is a track's filename
 * (e.g., `'Alpha_8_Hz.aac'`). When a track is downloaded, it is saved to `localForage` with the key as the track
 * (e.g., `'Alpha_8_Hz.aac'`), and the value as its `Blob`.
 */

// @ts-ignore: Missing module declaration
import trackUrls from '../../binaural_beats/tracks/*.aac';
import binauralBeats from '../../binaural_beats/data.json';
import localForage from 'localforage';
import 'regenerator-runtime/runtime';

/** Metadata on binaural beats for each brainwave */
export interface BinauralBeats {
    readonly alpha: Wave;
    readonly beta: Wave;
    readonly delta: Wave;
    readonly gamma: Wave;
    readonly theta: Wave;

    /** Dynamic way of accessing one of the five brainwaves */
    readonly [wave: string]: Wave;
}

/** Metadata on a brainwave's binaural beats */
export interface Wave {
    readonly minFrequency: number;
    readonly maxFrequency: number;
    readonly pure: ReadonlySet<PureTrack>;
    readonly isochronic?: ReadonlySet<IsochronicTrack>;
    readonly solfeggio?: ReadonlySet<SolfeggioTrack>;
    readonly explanation: string;
    readonly benefits: ReadonlySet<string>;
}

/** Metadata for a binaural beat (use [[PureTrack]], [[IsochronicTrack]], or [[SolfeggioTrack]] for all properties) */
export interface Track {
    readonly effects?: ReadonlySet<string>;
    readonly name: string;
    /** Audio's duration in seconds */
    readonly duration: number;
}

/**
 * Metadata for a binaural beat containing only a single frequency (use [[PureTrack]], [[IsochronicTrack]], or
 * [[SolfeggioTrack]] for all properties)
 */
export interface SingleFrequencyTrack extends Track {
    readonly frequency: number;
}

/** Metadata on a pure binaural beat */
export interface PureTrack extends SingleFrequencyTrack {
}

/** Metadata on a binaural beat mixed with isochronic pulses */
export interface IsochronicTrack extends SingleFrequencyTrack {
}

/** Metadata on a binaural beat mixed with solfeggio */
export interface SolfeggioTrack extends Track {
    readonly binauralBeatFrequency: number;
    readonly solfeggioFrequency: number;
}

export function getAllBrainwaves(): BinauralBeats {
    return binauralBeats as any as BinauralBeats;
}

/** Wave is `'alpha'`, `'beta'`, `'delta'`, `'gamma'`, or `'theta'` */
export function getBrainwave(wave: string): Wave {
    return getAllBrainwaves()[wave];
}

/**
 * Use [[trackHasEffects]] to check if this will return `undefined`.
 * @param name Track's name; if it doesn't exist this function will throw an `Error`
 */
export function getTrackEffects(name: string): ReadonlySet<string> | undefined {
    for (const wave of ['alpha', 'beta', 'delta', 'gamma', 'theta']) {
        const data = getBrainwave(wave);
        for (const track of data.pure) if (track.name === name) return track.effects;
        if (data.isochronic) for (const track of data.isochronic) if (track.name === name) return track.effects;
        if (data.solfeggio) for (const track of data.solfeggio) if (track.name === name) return track.effects;
    }
    throw Error(`Track ${name} doesn't exist`);
}

export function trackHasEffects(track: string): boolean {
    return getTrackEffects(track) !== undefined;
}

/**
 * The average browser will execute this for around 750 ms.
 * @returns Whether `track` has been downloaded
 */
export async function isDownloaded(track: string): Promise<boolean> {
    return (await localForage.keys()).includes(track);
}

/** Manages downloading and deleting tracks to and from persistent storage */
export abstract class TrackManager {
    /**
     * The keys are the tracks, and the values are functions callable to cancel the download. Tracks which are
     * queued to download (i.e., tracks which cannot currently be downloaded due to the lack of a network connection),
     * will also be present.
     */
    private static readonly downloading: Map<string, () => void> = new Map();

    /**
     * This function will download the track even if it has been previously downloaded. Unless manually aborted, it will
     * reattempt to download the track any number of times necessary. [[downloadAll]] is an alternative. This function
     * returns before finishing the download.
     */
    static async download(track: string): Promise<void> {
        const name = track.slice(0, track.lastIndexOf('.'));
        const controller = new AbortController();
        TrackManager.downloading.set(track, () => controller.abort());
        try {
            const response = await fetch(trackUrls[name], {signal: controller.signal});
            await saveTrack(track, await response.blob());
            TrackManager.downloading.delete(track);
        } catch (error) {
            if (error.name === 'AbortError') {
                TrackManager.downloading.delete(track);
            } else {
                const listener = () => TrackManager.download(track);
                addEventListener('online', listener, {once: true});
                TrackManager.downloading.set(track, () => removeEventListener('online', listener));
            }
        }
    }

    /** @param tracks Tracks to download in parallel (downloading/downloaded tracks will be skipped) */
    static async downloadAll(tracks: string[]): Promise<void> {
        for (const track of tracks) {
            if (!await isDownloaded(track) && !TrackManager.downloading.has(track)) TrackManager.download(track);
        }
    }

    /**
     * @param track If this track has been downloaded, it will be deleted from storage. If it is currently being
     * downloaded, the download will be cancelled. If it hasn't been downloaded, this function will do nothing.
     */
    static async deleteTrack(track: string): Promise<void> {
        if (TrackManager.downloading.has(track)) {
            TrackManager.downloading.get(track)!();
        } else {
            await localForage.removeItem(track);
        }
    }
}

/**
 * @param track The track to check the download status for
 * @param callback Called after `track` has finished downloading
 */
export async function awaitDownload(track: string, callback: () => void): Promise<void> {
    const id = setInterval(async () => {
        if (await isDownloaded(track)) {
            clearInterval(id);
            callback();
        }
    }, 1000);
}

/**
 * Saves a track to `localForage`
 * @param track `localForage` key
 * @param data `localForage` value
 */
export async function saveTrack(track: string, data: Blob): Promise<void> {
    await localForage.setItem(track, data);
}

export async function getAudio(track: string): Promise<Blob> {
    return await localForage.getItem(track);
}

/** @returns Duration of `track`'s audio in seconds */
export function getTrackDuration(track: string): number {
    return getTrack(track).duration;
}

/** An `Error` will be thrown if there is no track named `name` */
export function getTrack(name: string): PureTrack | IsochronicTrack | SolfeggioTrack {
    for (const track of getTracks()) if (track.name === name) return track;
    throw new Error(`There is no track named ${name}`)
}

export function getTracks(): Array<PureTrack | IsochronicTrack | SolfeggioTrack> {
    const tracks = [];
    for (const brainwave of Object.values(getAllBrainwaves())) {
        for (const track of brainwave.pure) tracks.push(track);
        if (brainwave.isochronic) for (const track of brainwave.isochronic) tracks.push(track);
        if (brainwave.solfeggio) for (const track of brainwave.solfeggio) tracks.push(track);
    }
    return tracks;
}

/** @returns Each track's name, regardless of whether it's been downloaded */
export function getTrackNames(): string[] {
    const names = [];
    for (const track of getTracks()) names.push(track.name);
    return names;
}

/** Deletes all downloaded tracks except `tracks` */
export async function pruneExcept(tracks: string[]): Promise<void> {
    getTrackNames().filter((track) => !tracks.includes(track)).forEach(async (track) => {
        await TrackManager.deleteTrack(track);
    });
}