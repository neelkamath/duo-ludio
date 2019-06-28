import {AccordionPanelElement} from '@vaadin/vaadin-accordion/src/vaadin-accordion-panel';
import * as binaurals from '../../binaural_beats/data.json';
import {CategoryAdderElement} from './category_adder';
import {CheckboxElement} from '@vaadin/vaadin-checkbox/src/vaadin-checkbox';
import * as storage from '../storage';
import {VerticalLayoutElement} from '@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout';
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab';
import * as waves from './waves.json';
import {WaveDetailsElement} from '../web_components/wave_details';
import {DismissDialogElement} from '../web_components/dismiss_dialog';
import {TrackDataElement} from '../web_components/track_data';

/** @returns The "Tracks" tab's content */
export function getContent(): HTMLSpanElement {
    const span = document.createElement('span');
    const content = document.createElement('div');
    const tabs = getTabs(content);
    tabs[0].click();
    const vaadinTabs = document.createElement('vaadin-tabs');
    for (const tab of tabs) vaadinTabs.appendChild(tab);
    span.appendChild(vaadinTabs);
    span.appendChild(content);
    return span;
}

/**
 * @param content Where the tab's content is placed
 * @returns Tabs for every brainwave
 */
function getTabs(content: HTMLDivElement): TabElement[] {
    return Object.entries(waves).filter(([wave]) => wave !== 'default').reduce((tabs, [wave, image]) => {
        const tab = getTab(wave, image);
        tab.addEventListener('click', () => {
            content.innerHTML = '';
            const data = binaurals[wave];
            content.appendChild(getDetails(data));
            content.appendChild(getTrackTypes(data));
        });
        tabs.push(tab);
        return tabs;
    }, new Array<TabElement>());
}

/**
 * @param wave The brainwave whose tab is to be created
 * @param image The tab's icon (`HTMLImageElement.src`)
 */
function getTab(wave: string, image: string): TabElement {
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

/** Metadata on a binaural beat having a single frequency */
interface SingleFrequencyTrack {
    /** Frequency (e.g., `0.9`) */
    frequency: number;
    /** Effects of hearing this track (e.g., `['Euphoric feeling']`) */
    effects?: string[];
    /** Track's name (e.g., `'Delta_0.9_Hz.mp3'`) */
    name: string;
}

/** Metadata on a pure binaural beat */
interface PureTrack extends SingleFrequencyTrack {
}

/** Metadata on a binaural beat mixed with isochronic pulses */
interface IsochronicTrack extends SingleFrequencyTrack {
}

/** Metadata on a binaural beat mixed with solfeggio */
interface SolfeggioTrack {
    /** Binaural beats' frequency (e.g., `3`) */
    binauralBeatFrequency: number;
    /** Solfeggio's frequency (e.g., `741`) */
    solfeggioFrequency: number;
    /** Effects of hearing this track (e.g., `['Deep state of relaxation']`) */
    effects: string[];
    /** Track's name (e.g., `'Delta_3_Hz_Solfeggio_741_Hz.mp3'`) */
    name: string;
}

/** Metadata on a brainwave's binaural beats */
interface WaveData {
    /** Starting frequency (e.g., `0.5`) */
    minFrequency: number;
    /** Ending frequency (e.g., `4`) */
    maxFrequency: number;
    /** Metadata on pure binaural beats */
    pure: PureTrack[];
    /** Metadata on the binaural beats mixed with solfeggio */
    solfeggio?: SolfeggioTrack[];
    /** Metadata on binaural beats mixed with isochronic pulses */
    isochronic?: IsochronicTrack[];
    /** What this range of binaural beats do */
    explanation: string;
    /** Positive effects of this brainwave */
    benefits: string[];
}

/** @param data The data from which a UI element is created */
function getDetails(data: WaveData): WaveDetailsElement {
    const details = document.createElement('wave-details') as WaveDetailsElement;
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

enum TrackType {pure, isochronic, solfeggio}

/** @param data The data from which the brainwave's tracks are made into a UI element */
function getTrackTypes(data: WaveData): HTMLSpanElement {
    const span = document.createElement('span');
    const dialog = document.createElement('dismiss-dialog') as DismissDialogElement;
    dialog.setAttribute('aria-label', 'Add track');
    span.appendChild(dialog);
    const accordion = document.createElement('vaadin-accordion');
    for (const type of [TrackType.pure, TrackType.isochronic, TrackType.solfeggio]) {
        accordion.appendChild(getTracks(data, TrackType[type.toString()], dialog));
    }
    span.appendChild(accordion);
    return span;
}

/**
 * @param data The data for the tracks of a particular type which are to be made into a UI element
 * @param type The type of tracks to extract from `data`
 * @param dialog Used to prompt the addition of a track to a category
 */
function getTracks(data: WaveData, type: TrackType, dialog: DismissDialogElement): AccordionPanelElement {
    const panel = document.createElement('vaadin-accordion-panel');
    const div = document.createElement('div');
    div.slot = 'summary';
    const h1 = document.createElement('h1');
    h1.textContent = type.toString()[0].toUpperCase() + type.toString().slice(1);
    div.appendChild(h1);
    panel.appendChild(div);
    const tracks = data[type.toString()].reduce((tracks, track) => {
        tracks.appendChild(getTrack(track, type, dialog));
        return tracks;
    }, document.createElement('span'));
    panel.appendChild(tracks);
    return panel;
}

function getEffects(track: PureTrack | IsochronicTrack | SolfeggioTrack): HTMLUListElement {
    return track.effects!.reduce((effects, effect) => {
        const li = document.createElement('li');
        li.innerHTML = effect;
        effects.appendChild(li);
        return effects;
    }, document.createElement('ul'));
}

/** `dialog` is used to prompt the addition of `track` to a category */
function getTrack(
    track: PureTrack | IsochronicTrack | SolfeggioTrack,
    type: TrackType,
    dialog: DismissDialogElement
): TrackDataElement {
    const data = document.createElement('track-data') as TrackDataElement;
    data.setAttribute('track-type', type.toString());
    if ([TrackType.pure, TrackType.isochronic].includes(TrackType[type.toString()])) {
        track = track as PureTrack | IsochronicTrack;
        data.setAttribute('hz', track.frequency.toString());
    } else if (TrackType[type.toString()] === TrackType.solfeggio) {
        track = track as SolfeggioTrack;
        data.setAttribute('binaural-hz', track.binauralBeatFrequency.toString());
        data.setAttribute('solfeggio-hz', track.solfeggioFrequency.toString());
    }
    if (track.effects !== undefined) data.appendChild(getEffects(track));
    data.addEventListener('add', () => new CategoryAdder(track.name, dialog));
    return data;
}

/** A dialog to add a track to a category */
class CategoryAdder {
    /**
     * @param track Track's name
     * @param dialog Used to render the category adder
     */
    constructor(private readonly track: string, dialog: DismissDialogElement) {
        dialog.render(this.getRenderer());
    }

    /** @returns Dialog's body */
    private getRenderer(): HTMLSpanElement {
        const span = document.createElement('span');
        const div = document.createElement('div');
        div.innerHTML = '<strong>Add to category</strong>';
        span.appendChild(div);
        const layout = this.getLayout();
        span.appendChild(this.getAdder(layout));
        span.appendChild(document.createElement('br'));
        span.appendChild(document.createElement('br'));
        span.appendChild(layout);
        return span;
    }

    /** @returns The layout containing the categories */
    private getLayout(): VerticalLayoutElement {
        const layout = document.createElement('vaadin-vertical-layout') as VerticalLayoutElement;
        layout.theme = 'spacing-xs';
        for (const name of storage.getCategoryNames()) layout.appendChild(this.createCategory(name));
        return layout;
    }

    /** @param layout The layout to which the category creator will be appended to */
    private getAdder(layout: VerticalLayoutElement): CategoryAdderElement {
        const adder = document.createElement('category-adder') as CategoryAdderElement;
        adder.addEventListener('add', ({detail}: CustomEvent) => {
            layout.appendChild(this.createCategory(detail));
        });
        return adder;
    }

    /**
     * @param category Category to which the track can be added
     * @returns The checkbox element to add the track
     */
    private createCategory(category: string): CheckboxElement {
        const checkbox = document.createElement('vaadin-checkbox') as CheckboxElement;
        if (storage.categoryHasTrack(category, this.track)) checkbox.setAttribute('checked', 'checked');
        checkbox.textContent = category;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                storage.addCategoryTrack(category, this.track);
            } else {
                storage.removeCategoryTrack(category, this.track);
            }
        });
        return checkbox;
    }
}