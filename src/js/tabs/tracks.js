import * as binaurals from '../../binaural_beats/data';
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
        <vaadin-tab id="${wave}-tab">
            <tab-icon alt="${utility.titleCase(wave)}" src="${image}"></tab-icon>
            ${utility.titleCase(wave)}
        </vaadin-tab>
    `;
}

class TabSetUp {
    constructor(wave) {
        this.data = binaurals[wave];
        document.querySelector(`#${wave}-tab`).addEventListener('click', () => {
            let content = document.querySelector('#binaurals-content');
            content.innerHTML = this._createDetails() + this._createTrackTypes();
            for (let track of document.querySelectorAll('track-data')) {
                track.button.addEventListener('click', () => new CategoryAdder(track.id));
            }
        });
    }

    _createDetails() {
        return `
            <wave-details
                id="details"
                min="${this.data['minFrequency']}"
                max="${this.data['maxFrequency']}"
                explanation="${utility.escapeHTML(this.data['explanation'])}"
            >
                <ul>${this.data['benefits'].map((benefit) => `<li>${benefit}</li>`).join('')}</ul>
            </wave-details>
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

    static getTrackData(track, trackType) {
        let effects = '';
        if ('effects' in track) effects = `<ul>${track['effects'].map((effect) => `<li>${effect}</li>`).join('')}</ul>`;
        return `
            <track-data 
                track-type="${trackType}" 
                ${['pure', 'isochronic'].includes(trackType) ? `hz="${track['frequency']}"` : ''}
                ${trackType === 'solfeggio' ? `binaural-hz="${track['binauralBeatFrequency']}"` : ''}
                ${trackType === 'solfeggio' ? `solfeggio-hz="${track['solfeggioFrequency']}"` : ''}
                id="${track['name']}"
            >
                ${effects}
            </track-data>
        `;
    }

    createTracks(trackType) {
        if (!this.data.hasOwnProperty(trackType)) return '';
        return `
            <vaadin-accordion-panel>
                <div slot="summary"><h1>${utility.titleCase(trackType)}</h1></div>
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
        let categories = JSON.parse(localStorage.getItem('categories'));
        let html = Object.entries(categories).reduce((html, [category, tracks]) => {
            let checked = tracks.includes(this.track) ? 'checked' : '';
            return html + `
                <vaadin-checkbox ${checked} class="category-checkbox" id="${category}">${category}</vaadin-checkbox>
            `;
        }, '');
        if (html === '') html = 'No categories';
        return `<vaadin-vertical-layout theme="spacing-xs">${html}</vaadin-vertical-layout>`;
    }

    _addCheckboxListeners() {
        for (let checkbox of document.querySelectorAll('.category-checkbox')) {
            checkbox.addEventListener('click', () => {
                let categories = JSON.parse(localStorage.getItem('categories'));
                let category = categories[checkbox.id];
                if (checkbox.checked) {
                    category.push(this.track);
                } else {
                    category.splice(category.indexOf(this.track), 1);
                }
                localStorage.setItem('categories', JSON.stringify(categories));
            });
        }
    }
}