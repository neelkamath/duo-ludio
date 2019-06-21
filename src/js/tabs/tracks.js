import * as binaurals from '../../binaural_beats/data';
import * as storage from '../storage';
import * as utility from '../utility';
import * as waves from "./waves";

export function setUpTab() {
    document.querySelector('#tracks-tab').addEventListener('click', () => {
        document.querySelector('#tab-content').innerHTML = `
            <vaadin-tabs id="wave-tabs">
                ${Object.entries(waves).filter(([wave]) => wave !== 'default').reduce(reducer, '')}
            </vaadin-tabs>
            <div id="binaurals-content"></div>
        `;
        for (let wave in binaurals) if (binaurals.hasOwnProperty(wave) && wave !== 'default') new TabSetUp(wave);
        clickFirstTab();
    });
}

function clickFirstTab() {
    // Use setTimeout() so that the DOM has time to load.
    setTimeout(() => document.querySelector('#wave-tabs').firstElementChild.click(), 10);
}

function reducer(accumulator, [wave, image]) {
    return accumulator + `
        <vaadin-tab id="${utility.escapeHTML(wave)}-tab">
            <tab-icon alt="${utility.escapeHTML(utility.titleCase(wave))}" src="${utility.escapeHTML(image)}">
            </tab-icon>
            ${utility.escapeHTML(utility.titleCase(wave))}
        </vaadin-tab>
    `;
}

class TabSetUp {
    constructor(wave) {
        this.data = binaurals[wave];
        let tab = document.querySelector(`#${utility.escapeHTML(wave)}-tab`);
        tab.addEventListener('click', () => {
            let content = document.querySelector('#binaurals-content');
            content.innerHTML = this._createDetails() + this._createTrackTypes();
            for (let track of document.querySelectorAll('track-data')) {
                track.button.addEventListener('click', () => new CategoryAdder(track.id));
            }
        });
    }

    static getTrackData(track, trackType) {
        let effects = '';
        if ('effects' in track) {
            effects = `<ul>${track['effects'].map((effect) => `<li>${utility.escapeHTML(effect)}</li>`).join('')}</ul>`;
        }
        let frequencies = '';
        if (trackType === 'solfeggio') {
            frequencies = `
                binaural-hz=${utility.escapeHTML(track['binauralBeatFrequency'])}
                solfeggio-hz=${utility.escapeHTML(track['solfeggioFrequency'])}
            `;
        }
        return `
            <track-data 
                track-type="${utility.escapeHTML(trackType)}" 
                ${['pure', 'isochronic'].includes(trackType) ? `hz="${utility.escapeHTML(track['frequency'])}"` : ''}
                ${frequencies}
                id="${utility.escapeHTML(track['name'])}"
            >
                ${effects}
            </track-data>
        `;
    }

    _createTrackTypes() {
        return `
            <ok-dialog aria-label="Add track" id="add-track-dialog"></ok-dialog>
            <vaadin-accordion>
                ${this.createTracks('pure')}
                ${this.createTracks('isochronic')}
                ${this.createTracks('solfeggio')}
            </vaadin-accordion>
        `;
    }

    _createDetails() {
        return `
            <wave-details
                id="details"
                min="${this.data['minFrequency']}"
                max="${this.data['maxFrequency']}"
                explanation="${utility.escapeHTML(this.data['explanation'])}"
            >
                <ul>${this.data['benefits'].map((benefit) => `<li>${utility.escapeHTML(benefit)}</li>`).join('')}</ul>
            </wave-details>
        `;
    }

    createTracks(trackType) {
        if (!this.data.hasOwnProperty(trackType)) return '';
        return `
            <vaadin-accordion-panel>
                <div slot="summary"><h1>${utility.escapeHTML(utility.titleCase(trackType))}</h1></div>
                ${this.data[trackType].reduce((tracks, track) => tracks + TabSetUp.getTrackData(track, trackType), '')}
            </vaadin-accordion-panel>
        `;
    }
}

class CategoryAdder {
    constructor(track) {
        this.track = track;
        let dialog = document.querySelector('#add-track-dialog');
        dialog.render(`
            <h3>Add to category</h3>
            <div>${this._createCategories(track)}</div>
        `);
        this._addCheckboxListeners();
    }

    _createCategories() {
        let categories = storage.getCategories();
        let html = Object.entries(categories).reduce((html, [key, value]) => {
            return html + `
                <vaadin-checkbox 
                    ${value['tracks'].includes(this.track) ? 'checked' : ''} 
                    class="category-checkbox" 
                    id="${utility.escapeHTML(value['id'])}"
                >
                    ${utility.escapeHTML(key)}
                </vaadin-checkbox>
            `;
        }, '');
        if (html === '') html = 'No categories';
        return `<vaadin-vertical-layout theme="spacing-xs">${html}</vaadin-vertical-layout>`;
    }

    _addCheckboxListeners() {
        for (let checkbox of document.querySelectorAll('.category-checkbox')) {
            checkbox.addEventListener('click', () => {
                let categories = storage.getCategories();
                let value = Object.values(categories).filter((value) => value['id'] === checkbox.id)[0];
                let tracks = value['tracks'];
                if (checkbox.checked) {
                    tracks.push(this.track);
                } else {
                    tracks.splice(tracks.indexOf(this.track), 1);
                }
                storage.setCategories(categories);
            });
        }
    }
}