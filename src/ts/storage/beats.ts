// @ts-ignore: Missing module declaration
import trackUrls from '../../../binaural_beats/tracks/*.mp3';
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

interface SingleFrequencyTrack extends Track {
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

/** Wave is `'alpha'`, `'beta'`, `'delta'`, `'gamma'`, or `'theta'` */
export function getBrainwave(wave: string): WaveData {
    return (binauralBeats as BinauralBeats)[wave];
}

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
 * @throws `Error` May be thrown for any reason; most probably because the network disconnected in between
 * @returns After `track` (e.g., `'Alpha_8_Hz.mp3'`) is downloaded to `localForage`
 */
export async function downloadTrack(track: string): Promise<void> {
    const response = await fetch(trackUrls[track.slice(0, track.lastIndexOf('.'))]);
    await saveTrack(track, await response.arrayBuffer());
}

/** Saves `data` to the `localForage` item `track` (e.g., `'Alpha_8_Hz.mp3'`) */
async function saveTrack(track: string, data: ArrayBuffer): Promise<void> {
    await localForage.setItem(track, data);
}

/**
 * The average browser will execute this for around 750 ms.
 * @returns Whether `track` (e.g., `'Alpha_8_Hz.mp3'`) has been downloaded
 */
export async function isDownloaded(track: string): Promise<boolean> {
    return (await localForage.keys()).includes(track);
}

/** Singleton for getting tracks */
export class TrackGetter {
    /** The keys are track names (e.g., `'Alpha_8_Hz.mp3'`), and the values are their audio buffers. */
    private static readonly memoizedTracks: Map<string, ArrayBuffer> = new Map();

    /**
     * The average browser will execute this for around 1 second to retrieve a one-hour long MP3. However, the
     * retrievals are cached, and hence subsequent calls for the same `track` will be around 200 ms faster.
     * @returns Audio for `track` (e.g., `'Alpha_8_Hz.mp3'`)
     */
    static async getTrack(track: string): Promise<ArrayBuffer> {
        if (!TrackGetter.memoizedTracks.has(track)) {
            TrackGetter.memoizedTracks.set(track, await localForage.getItem(track));
        }
        return TrackGetter.memoizedTracks.get(track)!;
    }
}