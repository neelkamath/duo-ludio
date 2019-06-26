import * as binaurals from '../../binaural_beats/data.json';
import * as storage from '../storage';
import * as waves from './waves.json';

export function getContent(): HTMLElement {
    const span = document.createElement('span');
    const binauralsContent = document.createElement('div');
    const tabs = getTabs(binauralsContent);
    tabs[0].click();
    const vaadinTabs = document.createElement('vaadin-tabs');
    for (const tab of tabs) vaadinTabs.appendChild(tab);
    span.appendChild(vaadinTabs);
    span.appendChild(binauralsContent);
    return span;
}

function getTabs(binauralsContent: HTMLDivElement): HTMLElement[] {
    return Object.entries(waves).filter(([wave]) => wave !== 'default').reduce((tabs, [wave, image]) => {
        const tab = getTab(wave, image);
        tab.addEventListener('click', () => {
            binauralsContent.innerHTML = '';
            const data = binaurals[wave];
            binauralsContent.appendChild(getDetails(data));
            binauralsContent.appendChild(getTrackTypes(data));
        });
        tabs.push(tab);
        return tabs;
    }, new Array<HTMLElement>());
}

function getTab(wave: string, image: string): HTMLElement {
    const title = wave[0].toUpperCase() + wave.slice(1);
    const tab = document.createElement('vaadin-tab');
    const icon = document.createElement('tab-icon');
    icon.setAttribute('alt', title);
    icon.setAttribute('src', image);
    tab.appendChild(icon);
    const span = document.createElement('span');
    span.textContent = title;
    tab.appendChild(span);
    return tab;
}

// Metadata on a binaural beat
interface Track {
    frequency: number; // Frequency (e.g., <0.9>)
    effects?: string[]; // Effects of hearing this track (e.g., <['Euphoric feeling']>)
    name: string; // Track's name (e.g., <'Delta_0.9_Hz.mp3'>)
}

// Metadata on pure binaural beats
interface PureTrack extends Track {
}

// Metadata on binaural beats mixed with isochronic pulses
interface IsochronicTrack extends Track {
}

// Metadata on the binaural beats mixed with solfeggio
interface SolfeggioTrack {
    binauralBeatFrequency: number; // Binaural beats' frequency (e.g., <3>)
    solfeggioFrequency: number; // Solfeggio's frequency (e.g., <741>)
    effects: string[]; // Effects of hearing this track (e.g., <['Deep state of relaxation']>)
    name: string; // Name of the track present in the tracks subdirectory (e.g., <'Delta_3_Hz_Solfeggio_741_Hz.mp3'>)
}

// Metadata on binaural beats for a particular brain wave
interface WaveData {
    minFrequency: number; // Starting frequency (e.g., <0.5>).
    maxFrequency: number; // Ending frequency (e.g., <4>).
    pure: PureTrack[]; // Metadata on pure binaural beats
    solfeggio?: SolfeggioTrack[]; // Metadata on the binaural beats mixed with solfeggio
    isochronic?: IsochronicTrack[]; // Metadata on binaural beats mixed with isochronic pulses
    explanation: string; // What this range of binaural beats do
    benefits: string[]; // Positive effects of this brainwave
}

function getDetails(data: WaveData) {
    const details = document.createElement('wave-details');
    details.setAttribute('min', data.minFrequency.toString());
    details.setAttribute('max', data.maxFrequency.toString());
    details.setAttribute('explanation', data.explanation);
    const benefits = data.benefits.reduce((benefits, benefit) => {
        const li = document.createElement('li');
        li.innerHTML = benefit;
        benefits.appendChild(li);
        return benefits;
    }, document.createElement('ul'));
    details.appendChild(benefits);
    return details;
}

function getTrackTypes(data: WaveData): HTMLElement {
    const span = document.createElement('span');
    const dialog = document.createElement('dismiss-dialog');
    dialog.setAttribute('aria-label', 'Add track');
    span.appendChild(dialog);
    const accordion = document.createElement('vaadin-accordion');
    for (const type of ['pure', 'isochronic', 'solfeggio']) {
        if (data.hasOwnProperty(type)) accordion.appendChild(getTracks(data, type, dialog));
    }
    span.appendChild(accordion);
    return span;
}

function getTracks(data: WaveData, type: string, dialog: HTMLElement): HTMLElement {
    const panel = document.createElement('vaadin-accordion-panel');
    const div = document.createElement('div');
    div.slot = 'summary';
    const h1 = document.createElement('h1');
    h1.textContent = type[0].toUpperCase() + type.slice(1);
    div.appendChild(h1);
    panel.appendChild(div);
    const tracks = data[type].reduce((tracks, track) => {
        tracks.appendChild(getTrack(track, type, dialog));
        return tracks;
    }, document.createElement('span'));
    panel.appendChild(tracks);
    return panel;
}

function getTrack(track: PureTrack | IsochronicTrack | SolfeggioTrack, type: string, dialog: HTMLElement): HTMLElement {
    const data = document.createElement('track-data');
    data.setAttribute('track-type', type);
    if (['pure', 'isochronic'].includes(type)) {
        track = track as PureTrack | IsochronicTrack;
        data.setAttribute('hz', track.frequency.toString());
    } else if (type === 'solfeggio') {
        track = track as SolfeggioTrack;
        data.setAttribute('binaural-hz', track.binauralBeatFrequency.toString());
        data.setAttribute('solfeggio-hz', track.solfeggioFrequency.toString());
    }
    if (track.effects !== undefined) {
        const effects = track.effects.reduce((effects, effect) => {
            const li = document.createElement('li');
            li.innerHTML = effect;
            effects.appendChild(li);
            return effects;
        }, document.createElement('ul'));
        data.appendChild(effects);
    }
    data.addEventListener('add', () => new CategoryAdder(track.name, dialog));
    return data;
}

class CategoryAdder {
    constructor(private readonly track: string, dialog: HTMLElement) {
        (dialog as any).render(this.renderer);
    }

    private get renderer(): HTMLElement {
        const span = document.createElement('span');
        const div = document.createElement('div');
        div.innerHTML = '<strong>Add to category</strong>';
        span.appendChild(div);
        const layout = this.layoutNode;
        span.appendChild(this.getAdder(layout));
        span.appendChild(document.createElement('br'));
        span.appendChild(document.createElement('br'));
        span.appendChild(layout);
        return span;
    }

    private get layoutNode(): HTMLElement {
        const layout: any = document.createElement('vaadin-vertical-layout');
        layout.theme = 'spacing-xs';
        for (const name of storage.getCategoryNames()) layout.appendChild(this.createCategory(name));
        return layout;
    }

    private getAdder(layout: HTMLElement): HTMLElement {
        const adder = document.createElement('category-adder');
        adder.addEventListener('add', ({detail}: CustomEvent) => {
            layout.appendChild(this.createCategory(detail));
        });
        return adder;
    }

    private createCategory(name: string): HTMLElement {
        const checkbox: any = document.createElement('vaadin-checkbox');
        if (storage.categoryHasTrack(name, this.track)) checkbox.setAttribute('checked', 'checked');
        checkbox.textContent = name;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                storage.addCategoryTrack(name, this.track);
            } else {
                storage.removeCategoryTrack(name, this.track);
            }
        });
        return checkbox;
    }
}