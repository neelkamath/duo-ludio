// @ts-ignore: Missing module declaration
import {CheckboxElement} from '@vaadin/vaadin-checkbox/src/vaadin-checkbox';
// @ts-ignore: Missing module declaration
import {VerticalLayoutElement} from '@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout';
// @ts-ignore: Missing module declaration
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab';
// @ts-ignore: Missing module declaration
import {AccordionPanelElement} from '@vaadin/vaadin-accordion/src/vaadin-accordion-panel';
import {AddEvent, CategoryAdderElement} from '../../web_components/components/category_adder';
import * as categories from '../../storage/categories';
import WaveDetailsElement from '../../web_components/components/wave_details';
import DismissDialogElement from '../../web_components/components/dismiss_dialog';
import TrackDataElement from '../../web_components/components/track_data';
import {getBrainwave, IsochronicTrack, PureTrack, SolfeggioTrack, WaveData} from '../../storage/beats';

/** @returns The 'Tracks' tab's content */
export default function (): HTMLSpanElement {
    const span = document.createElement('span');
    const content = document.createElement('div');
    const tabs = getTabs(content);
    tabs[0].click();
    const vaadinTabs = document.createElement('vaadin-tabs');
    for (const tab of tabs) vaadinTabs.append(tab);
    span.append(vaadinTabs, content);
    return span;
}

/**
 * @param content Where the tab's content is placed
 * @returns Tabs for every brainwave
 */
function getTabs(content: HTMLDivElement): TabElement[] {
    const waves = {
        alpha: 'https://bit.ly/2wTc8tv',
        beta: 'https://bit.ly/2F7YAyU',
        delta: 'https://bit.ly/2WJ83az',
        gamma: 'https://bit.ly/2WGfzOP',
        theta: 'https://bit.ly/2WFjrPV'
    };
    return Object.entries(waves).reduce((tabs, [wave, image]) => {
        const tab = getTab(wave, image);
        tab.addEventListener('click', () => {
            content.innerHTML = '';
            const data = getBrainwave(wave);
            content.append(getDetails(data), getTrackTypes(data));
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
    tab.append(icon, document.createTextNode(title));
    return tab;
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
        benefits.append(li);
        return benefits;
    }, document.createElement('ul'));
    details.append(benefits);
    return details;
}

enum TrackType {pure = 'pure', isochronic = 'isochronic', solfeggio = 'solfeggio'}

/** @param data The data from which the brainwave's tracks are made into a UI element */
function getTrackTypes(data: WaveData): HTMLSpanElement {
    const span = document.createElement('span');
    const dialog = document.createElement('dismiss-dialog') as DismissDialogElement;
    dialog.setAttribute('aria-label', 'Add track');
    span.append(dialog);
    const accordion = document.createElement('vaadin-accordion');
    accordion.append(getTracks(data.pure, TrackType.pure, dialog));
    if (data.isochronic) accordion.append(getTracks(data.isochronic, TrackType.isochronic, dialog));
    if (data.solfeggio) accordion.append(getTracks(data.solfeggio, TrackType.solfeggio, dialog));
    span.append(accordion);
    return span;
}

/** `dialog` is used to prompt the addition of a track to a category */
function getTracks(
    data: PureTrack[] | IsochronicTrack[] | SolfeggioTrack[],
    type: TrackType,
    dialog: DismissDialogElement
): AccordionPanelElement {
    const panel = document.createElement('vaadin-accordion-panel');
    const h1 = document.createElement('h1');
    h1.slot = 'summary';
    h1.textContent = type[0].toUpperCase() + type.slice(1);
    const tracks = (data as []).reduce((tracks, track) => {
        tracks.append(getTrack(track, type, dialog));
        return tracks;
    }, document.createElement('span'));
    panel.append(h1, tracks);
    return panel;
}

/** `dialog` is used to prompt the addition of `track` to a category */
function getTrack(
    track: PureTrack | IsochronicTrack | SolfeggioTrack,
    type: TrackType,
    dialog: DismissDialogElement
): TrackDataElement {
    const data = document.createElement('track-data') as TrackDataElement;
    data.setAttribute('track-type', type);
    if ([TrackType.pure, TrackType.isochronic].includes(type)) {
        track = track as PureTrack | IsochronicTrack;
        data.setAttribute('hz', track.frequency.toString());
    } else if (type === TrackType.solfeggio) {
        track = track as SolfeggioTrack;
        data.setAttribute('binaural-hz', track.binauralBeatFrequency.toString());
        data.setAttribute('solfeggio-hz', track.solfeggioFrequency.toString());
    }
    if (track.effects) data.append(getEffects(track));
    data.addEventListener('add', () => new CategoryAdder(track.name, dialog));
    return data;
}

function getEffects(track: PureTrack | IsochronicTrack | SolfeggioTrack): HTMLUListElement {
    return track.effects!.reduce((effects, effect) => {
        const li = document.createElement('li');
        li.innerHTML = effect;
        effects.append(li);
        return effects;
    }, document.createElement('ul'));
}

/** A dialog to add a track to a category */
class CategoryAdder {
    /** `dialog` is used to render the category adder */
    constructor(private readonly track: string, dialog: DismissDialogElement) {
        this.render(dialog);
    }

    async render(dialog: DismissDialogElement): Promise<void> {
        dialog.render(await this.getRenderer());
    }

    /** @returns Dialog's body */
    private async getRenderer(): Promise<HTMLSpanElement> {
        const span = document.createElement('span');
        const div = document.createElement('div');
        div.innerHTML = '<strong>Add to category</strong>';
        const layout = await this.getLayout();
        span.append(
            div, this.getAdder(layout),
            document.createElement('br'),
            document.createElement('br'),
            layout
        );
        return span;
    }

    /** @returns The layout containing the categories */
    private async getLayout(): Promise<VerticalLayoutElement> {
        const layout = document.createElement('vaadin-vertical-layout') as VerticalLayoutElement;
        layout.theme = 'spacing-xs';
        for (const name of await categories.getNames()) layout.append(await this.getCategory(name));
        return layout;
    }

    /** @param layout The layout to which the category creator will be appended to */
    private getAdder(layout: VerticalLayoutElement): CategoryAdderElement {
        const adder = document.createElement('category-adder') as CategoryAdderElement;
        adder.addEventListener('add', async (event) => {
            layout.append(await this.getCategory((event as AddEvent).data));
        });
        return adder;
    }

    /**
     * @param category Category to which the track can be added
     * @returns The checkbox element to add the track
     */
    private async getCategory(category: string): Promise<CheckboxElement> {
        const checkbox = document.createElement('vaadin-checkbox') as CheckboxElement;
        if (await categories.hasTrack(category, this.track)) checkbox.setAttribute('checked', 'checked');
        checkbox.textContent = category;
        checkbox.addEventListener('change', async () => {
            if (checkbox.checked) {
                await categories.addTrack(category, this.track);
            } else {
                await categories.removeTrack(category, this.track);
            }
        });
        return checkbox;
    }
}