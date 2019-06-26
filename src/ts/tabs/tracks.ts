import * as binaurals from '../../binaural_beats/data.json';
import * as storage from '../storage';
import * as waves from './waves.json';

export function getContent() {
    let span = document.createElement('span');
    let binauralsContent = document.createElement('div');
    let tabs = getTabs(binauralsContent);
    (tabs[0] as any).click();
    let vaadinTabs = document.createElement('vaadin-tabs');
    for (let tab of tabs) vaadinTabs.appendChild(tab);
    span.appendChild(vaadinTabs);
    span.appendChild(binauralsContent);
    return span;
}

function getTabs(binauralsContent) {
    return Object.entries(waves).filter(([wave]) => wave !== 'default').reduce((tabs, [wave, image]) => {
        let tab = getTab(wave, image);
        tab.addEventListener('click', () => {
            binauralsContent.innerHTML = '';
            let data = binaurals[wave];
            binauralsContent.appendChild(getDetails(data));
            binauralsContent.appendChild(getTrackTypes(data));
        });
        (tabs as any).push(tab);
        return tabs;
    }, []);
}

function getTab(wave, image) {
    let title = wave[0].toUpperCase() + wave.slice(1);
    let tab = document.createElement('vaadin-tab');
    let icon = document.createElement('tab-icon');
    icon.setAttribute('alt', title);
    icon.setAttribute('src', image);
    tab.appendChild(icon);
    let span = document.createElement('span');
    span.textContent = title;
    tab.appendChild(span);
    return tab;
}

function getDetails(data) {
    let details = document.createElement('wave-details');
    details.setAttribute('min', data['minFrequency']);
    details.setAttribute('max', data['maxFrequency']);
    details.setAttribute('explanation', data['explanation']);
    let benefits = data['benefits'].reduce((benefits, benefit) => {
        let li = document.createElement('li');
        li.innerHTML = benefit;
        benefits.appendChild(li);
        return benefits;
    }, document.createElement('ul'));
    details.appendChild(benefits);
    return details;
}

function getTrackTypes(data) {
    let span = document.createElement('span');
    let dialog = document.createElement('dismiss-dialog');
    dialog.setAttribute('aria-label', 'Add track');
    span.appendChild(dialog);
    let accordion = document.createElement('vaadin-accordion');
    for (let type of ['pure', 'isochronic', 'solfeggio']) {
        if (data.hasOwnProperty(type)) accordion.appendChild(getTracks(data, type, dialog));
    }
    span.appendChild(accordion);
    return span;
}

function getTracks(data, type, dialog) {
    let panel = document.createElement('vaadin-accordion-panel');
    let div = document.createElement('div');
    div.slot = 'summary';
    let h1 = document.createElement('h1');
    h1.textContent = type[0].toUpperCase() + type.slice(1);
    div.appendChild(h1);
    panel.appendChild(div);
    let reduceTracks = (tracks, track) => {
        tracks.appendChild(getTrack(track, type, dialog));
        return tracks;
    };
    panel.appendChild(data[type].reduce(reduceTracks, document.createElement('span')));
    return panel;
}

function getTrack(track, type, dialog) {
    let data = document.createElement('track-data');
    data.setAttribute('track-type', type);
    if (['pure', 'isochronic'].includes(type)) {
        data.setAttribute('hz', track['frequency']);
    } else if (type === 'solfeggio') {
        data.setAttribute('binaural-hz', track['binauralBeatFrequency']);
        data.setAttribute('solfeggio-hz', track['solfeggioFrequency']);
    }
    if ('effects' in track) {
        let effects = track['effects'].reduce((effects, effect) => {
            let li = document.createElement('li');
            li.innerHTML = effect;
            effects.appendChild(li);
            return effects;
        }, document.createElement('ul'));
        data.appendChild(effects);
    }
    data.addEventListener('add', () => new CategoryAdder(track['name'], dialog));
    return data;
}

class CategoryAdder {
    _track: any;

    constructor(track, dialog) {
        this._track = track;
        dialog.render(this._renderer);
    }

    get _renderer() {
        let span = document.createElement('span');
        let div = document.createElement('div');
        div.innerHTML = '<strong>Add to category</strong>';
        span.appendChild(div);
        let layout = this._layoutNode;
        span.appendChild(this._getAdder(layout));
        span.appendChild(document.createElement('br'));
        span.appendChild(document.createElement('br'));
        span.appendChild(layout);
        return span;
    }

    get _layoutNode() {
        let layout: any = document.createElement('vaadin-vertical-layout');
        layout.theme = 'spacing-xs';
        for (let name of storage.getCategoryNames()) layout.appendChild(this._createCategory(name));
        return layout;
    }

    _getAdder(layout) {
        let adder = document.createElement('category-adder');
        adder.addEventListener('add', ({detail}: CustomEvent) => {
            layout.appendChild(this._createCategory(detail));
        });
        return adder;
    }

    _createCategory(name) {
        let checkbox: any = document.createElement('vaadin-checkbox');
        if (storage.categoryHasTrack(name, this._track)) {
            checkbox.setAttribute('checked', 'checked');
        }
        checkbox.textContent = name;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                storage.addCategoryTrack(name, this._track);
            } else {
                storage.removeCategoryTrack(name, this._track);
            }
        });
        return checkbox;
    }
}