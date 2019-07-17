// @ts-ignore: Missing module declaration
import {CheckboxElement} from '@vaadin/vaadin-checkbox/src/vaadin-checkbox';
// @ts-ignore: Missing module declaration
import {VerticalLayoutElement} from '@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout';
// @ts-ignore: Missing module declaration
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab';
// @ts-ignore: Missing module declaration
import {AccordionPanelElement} from '@vaadin/vaadin-accordion/src/vaadin-accordion-panel';
import {AddEvent, CategoryAdderElement} from '../web_components/components/category-adder';
import * as categories from '../storage/categories';
import WaveDetailsElement from '../web_components/components/wave-details';
import DismissDialogElement from '../web_components/components/dismiss-dialog';
import {TrackDataElement} from '../web_components/components/track-data';
import * as beats from '../storage/beats';

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
    return ['alpha', 'beta', 'delta', 'gamma', 'theta'].reduce((tabs, wave) => {
        const tab = document.createElement('vaadin-tab');
        tab.append(document.createTextNode(wave));
        tab.addEventListener('click', () => {
            for (const child of content.childNodes) child.remove();
            const data = beats.getBrainwave(wave);
            content.append(getDetails(data), getTrackTypes(data));
        });
        tabs.push(tab);
        return tabs;
    }, new Array<TabElement>());
}

/** @param data The data from which a UI element is created */
function getDetails(data: beats.Wave): WaveDetailsElement {
    const details = document.createElement('wave-details') as WaveDetailsElement;
    details.min = data.minFrequency;
    details.max = data.maxFrequency;
    details.explanation = data.explanation;
    const benefits = [...data.benefits].reduce((benefits, benefit) => {
        const li = document.createElement('li');
        li.innerHTML = benefit;
        benefits.append(li);
        return benefits;
    }, document.createElement('ul'));
    details.append(benefits);
    return details;
}

/** @param data The data from which the brainwave's tracks are made into a UI element */
function getTrackTypes(data: beats.Wave): HTMLSpanElement {
    const span = document.createElement('span');
    const dialog = document.createElement('dismiss-dialog') as DismissDialogElement;
    dialog.setAttribute('aria-label', 'Add track');
    span.append(dialog);
    const accordion = document.createElement('vaadin-accordion');
    accordion.append(getTracks(data.pure, 'Pure', dialog));
    if (data.isochronic) accordion.append(getTracks(data.isochronic, 'Isochronic', dialog));
    if (data.solfeggio) accordion.append(getTracks(data.solfeggio, 'Solfeggio', dialog));
    span.append(accordion);
    return span;
}

/** `dialog` is used to prompt the addition of a track to a category */
function getTracks(
    data: ReadonlySet<beats.PureTrack> | ReadonlySet<beats.IsochronicTrack> | ReadonlySet<beats.SolfeggioTrack>,
    type: 'Pure' | 'Isochronic' | 'Solfeggio',
    dialog: DismissDialogElement
): AccordionPanelElement {
    const panel = document.createElement('vaadin-accordion-panel');
    const h1 = document.createElement('h1');
    h1.slot = 'summary';
    h1.textContent = type;
    const tracks = [...data].reduce((tracks, track) => {
        tracks.append(getTrack(track, dialog));
        return tracks;
    }, document.createElement('span'));
    panel.append(h1, tracks);
    return panel;
}

/** `dialog` is used to prompt the addition of `track` to a category */
function getTrack(
    track: beats.PureTrack | beats.IsochronicTrack | beats.SolfeggioTrack,
    dialog: DismissDialogElement
): TrackDataElement {
    const data = document.createElement('track-data') as TrackDataElement;
    if ('solfeggioFrequency' in track) {
        data.setTrack(
            {binauralBeatFrequency: track.binauralBeatFrequency, solfeggioFrequency: track.solfeggioFrequency}
        );
    } else {
        data.setTrack({frequency: track.frequency});
    }
    if (track.effects) data.append(getEffects(track));
    data.addEventListener('add', () => new CategoryAdder(track.name, dialog));
    return data;
}

function getEffects(track: beats.PureTrack | beats.IsochronicTrack | beats.SolfeggioTrack): HTMLUListElement {
    return [...track.effects!].reduce((effects, effect) => {
        const li = document.createElement('li');
        li.innerHTML = effect;
        effects.append(li);
        return effects;
    }, document.createElement('ul'));
}

/** A dialog to add a track to a category */
class CategoryAdder {
    /**
     * @param track Track to prompt for addition to a category (e.g., `'Alpha_8_Hz.aac'`)
     * @param dialog is used to render the category adder
     */
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
        if (await categories.hasTrack(category, this.track)) checkbox.checked = true;
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