import * as binaurals from '../../binaural_beats/data';
import * as utility from '../utility';
import * as waves from "./waves";

export function setUpTab() {
    document.querySelector('#tracks-tab').addEventListener('click', () => {
        document.querySelector('#tab-content').innerHTML = `
            <vaadin-tabs id="wave-tabs">${getTabs()}</vaadin-tabs>
            <div id="binaurals-content"></div>
        `;
        for (let wave in binaurals) if (binaurals.hasOwnProperty(wave) && wave !== 'default') new TabSetUp(wave);

        // Use setTimeout() so that the DOM has time to load.
        setTimeout(() => document.querySelector('#wave-tabs').firstElementChild.click(), 10);
    });
}

function getTabs() {
    let html = '';
    for (let [wave, image] of Object.entries(waves)) {
        if (wave === 'default') continue;
        html += `
            <vaadin-tab id="${wave}-tab">
                <tab-icon alt="${utility.titleCase(wave)}" src="${image}"></tab-icon>
                ${utility.titleCase(wave)}
            </vaadin-tab>
        `;
    }
    return html;
}

class TabSetUp {
    constructor(wave) {
        this.data = binaurals[wave];
        document.querySelector(`#${wave}-tab`).addEventListener('click', () => {
            let content = document.querySelector('#binaurals-content');
            content.innerHTML = this._createDetails() + this._createTrackTypes();
            for (let button of document.querySelectorAll('.track-button')) {
                button.addEventListener('click', () => new CategoryAdder(button.id));
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

    createTracks(trackType) {
        if (!this.data.hasOwnProperty(trackType)) return '';
        let tracks = '';
        for (let track of this.data[trackType]) tracks += new TrackData(track).getData(trackType);
        return `
            <vaadin-accordion-panel>
                <div slot="summary"><h1>${utility.titleCase(trackType)}</h1></div>
                ${tracks}
            </vaadin-accordion-panel>
        `;
    }
}

class TrackData {
    constructor(track) {
        this.track = track;
    }

    get _trackEffects() {
        if ('effects' in this.track) {
            return `
                <div class="block">
                    <titled-item title="Effects">
                        <ul>${this.track['effects'].map((effect) => `<li>${effect}</li>`).join('')}</ul>
                    </titled-item>
                </div>
            `;
        }
        return '';
    }

    get _addButton() {
        return `
            <div class="block">
                <vaadin-button class="track-button" id="${this.track['name']}">
                    <iron-icon icon="vaadin:plus" slot="prefix"></iron-icon> 
                    Add to category
                </vaadin-button>
            </div>
        `;
    }

    getData(trackType) {
        return `
            <vaadin-vertical-layout>
                ${this._createFrequency(trackType)}
                ${this._trackEffects}
                ${this._addButton}
            </vaadin-vertical-layout>
        `;
    }

    _createFrequency(trackType) {
        let text = '';
        if (trackType === 'pure' || trackType === 'isochronic') {
            text = `${this.track['frequency']} Hz`;
        } else if (trackType === 'solfeggio') {
            text = `${this.track['binauralBeatFrequency']} Hz (${this.track['solfeggioFrequency']} Hz Solfeggio)`;
        }
        return `<div class="block"><h2>Frequency: ${text}</h2></div>`;
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
        let html = '';
        for (let [category, tracks] of Object.entries(categories)) {
            let checked = tracks.includes(this.track) ? 'checked' : '';
            html += `
                <vaadin-checkbox ${checked} class="category-checkbox" id="${category}">${category}</vaadin-checkbox>
            `;
        }
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