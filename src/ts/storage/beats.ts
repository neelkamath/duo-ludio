/**
 * This is the abstraction layer for dealing with binaural beats. A "track" is a track's filename
 * (e.g., `'Alpha_8_Hz.mp3'`). When a track is downloaded, it is saved to `localForage` with the key as the track
 * (e.g., `'Alpha_8_Hz.mp3'`), and the value as its `ArrayBuffer`.
 */

// @ts-ignore: Missing module declaration
import trackUrls from '../../binaural_beats/tracks/*.mp3';
import binauralBeats from '../../binaural_beats/data.json';
import localForage from 'localforage';

/** Metadata on binaural beats for each brainwave */
export interface BinauralBeats {
    readonly alpha: WaveData;
    readonly beta: WaveData;
    readonly delta: WaveData;
    readonly gamma: WaveData;
    readonly theta: WaveData;

    /** Dynamic way of accessing one of the five brainwaves */
    readonly [wave: string]: WaveData;
}

/** Metadata on a brainwave's binaural beats */
export interface WaveData {
    readonly minFrequency: number;
    readonly maxFrequency: number;
    readonly pure: PureTrack[];
    readonly isochronic?: IsochronicTrack[];
    readonly solfeggio?: SolfeggioTrack[];
    readonly explanation: string;
    readonly benefits: string[];
}

interface Track {
    readonly effects?: string[];
    readonly name: string;
}

/** Metadata on a binaural beat containing only a single frequency */
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
    return binauralBeats;
}

/** Wave is `'alpha'`, `'beta'`, `'delta'`, `'gamma'`, or `'theta'` */
export function getBrainwave(wave: string): WaveData {
    return getAllBrainwaves()[wave];
}

/**
 * Use [[trackHasEffects]] to check if this will return `undefined`.
 * @param name Track's name; if it doesn't exist this function will throw an `Error`
 */
export function getTrackEffects(name: string): string[] | undefined {
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

/**
 * This function will download the track even if it has been previously downloaded. It will handle re-downloading the
 * track when the network goes offline/online. This function returns before finishing the download. You may want to use
 * [[downloadTracks]] instead.
 */
export async function downloadTrack(track: string): Promise<void> {
    try {
        const response = await fetch(trackUrls[track.slice(0, track.lastIndexOf('.'))]);
        await saveTrack(track, await response.arrayBuffer());
    } catch {
        addEventListener('online', () => downloadTrack(track), {once: true});
    }
}

/** @param tracks The tracks to download in parallel (previously downloaded tracks will not be downloaded) */
export async function downloadTracks(tracks: string[]): Promise<void> {
    for (const track of tracks) if (!await isDownloaded(track)) downloadTrack(track);
}

/** @returns After `track` has finished downloading */
export async function awaitDownload(track: string): Promise<void> {
    while (!await isDownloaded(track)) ;
}

/**
 * Saves a track to `localForage`
 * @param track `localForage` key
 * @param data `localForage` value
 */
export async function saveTrack(track: string, data: ArrayBuffer): Promise<void> {
    await localForage.setItem(track, data);
}

/**
 * It's safe to call this function with a track which hasn't been downloaded.
 * @param track Track to remove from storage
 */
export async function deleteTrack(track: string): Promise<void> {
    await localForage.removeItem(track);
}

/** Singleton for getting tracks */
export class TrackGetter {
    /** Keys are tracks; values are audios */
    private static readonly memoizedTracks: Map<string, ArrayBuffer> = new Map();

    /**
     * The average browser will execute this for around 1 second to retrieve a one-hour long MP3. However, the
     * retrievals are cached, and hence subsequent calls for the same `track` will be around 200 ms faster.
     * @returns `track`'s audio
     */
    static async getTrack(track: string): Promise<ArrayBuffer> {
        if (!TrackGetter.memoizedTracks.has(track)) {
            TrackGetter.memoizedTracks.set(track, await localForage.getItem(track));
        }
        return TrackGetter.memoizedTracks.get(track)!;
    }
}

/** @returns Each track's name, regardless of whether it's been downloaded */
export function getAllTracks(): string[] {
    const tracks = [];
    for (const brainwave of Object.values(getAllBrainwaves())) {
        for (const track of brainwave.pure) tracks.push(track.name);
        if (brainwave.isochronic) for (const track of brainwave.isochronic) tracks.push(track.name);
        if (brainwave.solfeggio) for (const track of brainwave.solfeggio) tracks.push(track.name);
    }
    return tracks;
}

/** Deletes all downloaded tracks except `tracks` */
export async function pruneExcept(tracks: string[]): Promise<void> {
    getAllTracks().filter((track) => !tracks.includes(track)).forEach(async (track) => {
        await deleteTrack(track);
    });
}