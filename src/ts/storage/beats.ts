import binaurals from '../../binaural_beats/data.json';

/** Metadata on binaural beats for each brainwave */
export interface BinauralBeats {
    readonly alpha: WaveData;
    readonly beta: WaveData;
    readonly delta: WaveData;
    readonly gamma: WaveData;
    readonly theta: WaveData;

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

/** Metadata on a binaural beat having a single frequency */
export interface SingleFrequencyTrack {
    readonly frequency: number;
    readonly effects?: string[];
    readonly name: string;
}

/** Metadata on a pure binaural beat */
export interface PureTrack extends SingleFrequencyTrack {
}

/** Metadata on a binaural beat mixed with isochronic pulses */
export interface IsochronicTrack extends SingleFrequencyTrack {
}

/** Metadata on a binaural beat mixed with solfeggio */
export interface SolfeggioTrack {
    readonly binauralBeatFrequency: number;
    readonly solfeggioFrequency: number;
    readonly effects: string[];
    readonly name: string;
}

/** Returns data for an `'alpha'`, `'beta'`, `'delta'`, `'gamma'`, or `'theta'` wave. */
export function getWaveData(wave: string): WaveData {
    return (binaurals as BinauralBeats)[wave];
}