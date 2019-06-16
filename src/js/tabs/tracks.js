import * as binaurals from '../../binaural_beats/data';
import * as utility from '../utility';

export function setUpTracksTab() {
    document.querySelector('#tracks-tab').addEventListener('click', () => {
        fillHTML();
        for (let wave in binaurals) if (binaurals.hasOwnProperty(wave) && wave !== 'default') new TabSetUp(wave);

        // Use setTimeout() so the DOM has time to load.
        setTimeout(() => document.querySelector('#wave-tabs').firstElementChild.click(), 10);
    });
}

function fillHTML() {
    document.querySelector('#tab-content').innerHTML = `
        <vaadin-tabs id="wave-tabs">
            <vaadin-tab id="alpha-tab">
                <tab-icon alt="Alpha" src="https://bit.ly/2wTc8tv"></tab-icon>
                Alpha
            </vaadin-tab>
            <vaadin-tab id="beta-tab">
                <tab-icon alt="Beta" src="https://bit.ly/2F7YAyU"></tab-icon>
                Beta
            </vaadin-tab>
            <vaadin-tab id="delta-tab">
                <tab-icon alt="Delta" src="https://bit.ly/2WJ83az"></tab-icon>
                Delta
            </vaadin-tab>
            <vaadin-tab id="gamma-tab">
                <tab-icon alt="Gamma" src="https://bit.ly/2WGfzOP"></tab-icon>
                Gamma
            </vaadin-tab>
            <vaadin-tab id="theta-tab">
                <tab-icon alt="Theta" src="https://bit.ly/2WFjrPV"></tab-icon>
                Theta
            </vaadin-tab>
        </vaadin-tabs>
        <div id="binaurals-content"></div>
    `;
}

class TabSetUp {
    constructor(wave) {
        this.data = binaurals[wave];
        document.querySelector(`#${wave}-tab`).addEventListener('click', () => {
            this._fillTabHTML();
            this._addAddButtonEventListeners();
        });
    }

    static _createDialogHTML(track) {
        return `
            <h3>Add to category</h3>
            <div>${TabSetUp._createDialogCategoriesHTML(track)}</div>
            <vaadin-button id="add-track-ok-button" class="dialog-button">OK</vaadin-button>
        `;
    }

    static _addDialogEventListeners(dialog, track) {
        TabSetUp._addDialogOKButtonEventListener(dialog);
        TabSetUp._addDialogCheckboxEventListeners(track);
    }

    static _addDialogOKButtonEventListener(dialog) {
        document
            .querySelector('#add-track-ok-button')
            .addEventListener('click', () => dialog.opened = false);
    }

    static _addDialogCheckboxEventListeners(track) {
        for (let checkbox of document.querySelectorAll('.category-checkbox')) {
            checkbox.addEventListener('click', () => {
                let categories = JSON.parse(localStorage.getItem('categories'));
                let category = categories[checkbox.id];
                if (checkbox.checked) {
                    category.push(track);
                } else {
                    category.splice(category.indexOf(track), 1);
                }
                localStorage.setItem('categories', JSON.stringify(categories));
            });
        }
    }

    static _createDialogCategoriesHTML(track) {
        let categories = JSON.parse(localStorage.getItem('categories'));
        let html = '';
        for (let [category, tracks] of Object.entries(categories)) {
            let checked = tracks.includes(track) ? 'checked' : '';
            html += `
                <vaadin-checkbox ${checked} class="category-checkbox" id="${category}">${category}</vaadin-checkbox>
            `;
        }
        return `<vaadin-vertical-layout theme="spacing-xs">${html}</vaadin-vertical-layout>`;
    }

    static _createAddButtonHTML(trackName) {
        return `
            <div class="block">
                <vaadin-button class="track-button" id="${trackName}">
                    <iron-icon icon="vaadin:plus" slot="prefix"></iron-icon> 
                    Add to category
                </vaadin-button>
            </div>
        `;
    }

    static _createFrequencyHTML(track, trackType) {
        let text = '';
        if (trackType === 'pure' || trackType === 'isochronic') {
            text = `${track['frequency']} Hz`;
        } else if (trackType === 'solfeggio') {
            text = `${track['binauralBeatFrequency']} Hz (${track['solfeggioFrequency']} Hz Solfeggio)`;
        }
        return `<div class="block"><h2>Frequency: ${text}</h2></div>`;
    }

    static _createTrackEffectsHTML(track) {
        if ('effects' in track) {
            return `
                <div class="block">
                    <titled-item 
                        title="Effects" 
                        body="<ul>${track['effects'].map((effect) => `<li>${effect}</li>`).join('')}</ul>"
                    ></titled-item>
                </div>
            `;
        }
        return '';
    }

    static _titleCase(trackType) {
        return trackType[0].toUpperCase() + trackType.slice(1);
    }

    _fillTabHTML() {
        let content = document.querySelector('#binaurals-content');
        content.innerHTML = '';
        content.appendChild(this._createDetailsHTML());
        content.appendChild(this._createTrackTypesHTML());
        let benefits = this.data['benefits'].map((benefit) => `<li>${benefit}</li>`).join('');
        document.querySelector('#details').benefits.innerHTML = `<ul>${benefits}</ul>`;
    }

    _addAddButtonEventListeners() {
        for (let button of document.querySelectorAll('.track-button')) {
            button.addEventListener('click', () => this._promptAdd(button.id));
        }
    }

    _promptAdd(track) {
        let dialog = document.querySelector('#add-track-dialog');
        dialog.renderer = (root) => root.innerHTML = TabSetUp._createDialogHTML(track);
        dialog.opened = true;
        TabSetUp._addDialogEventListeners(dialog, track);
    }

    _createDetailsHTML() {
        let details = document.createElement('span');
        details.innerHTML = `
            <wave-details
                id="details"
                min-frequency="${this.data['minFrequency']}"
                max-frequency="${this.data['maxFrequency']}"
                explanation="${utility.escapeHTML(this.data['explanation'])}"
            ></wave-details>
        `;
        return details;
    }

    _createTrackTypesHTML() {
        let span = document.createElement('span');
        span.innerHTML = `
            <vaadin-dialog id="add-track-dialog"></vaadin-dialog>
            <vaadin-accordion>
                ${this._createTracksHTML('pure')}
                ${this._createTracksHTML('isochronic')}
                ${this._createTracksHTML('solfeggio')}
            </vaadin-accordion>
        `;
        return span;
    }

    _createTracksHTML(trackType) {
        if (!this.data.hasOwnProperty(trackType)) return '';
        let tracks = '';
        for (let track of this.data[trackType]) {
            tracks += `
                <vaadin-vertical-layout>
                    ${TabSetUp._createFrequencyHTML(track, trackType)}
                    ${TabSetUp._createTrackEffectsHTML(track)}
                    ${TabSetUp._createAddButtonHTML(track['name'])}
                </vaadin-vertical-layout>
            `;
        }
        return `
            <vaadin-accordion-panel>
                <div slot="summary"><h1>${TabSetUp._titleCase(trackType)}</h1></div>
                ${tracks}
            </vaadin-accordion-panel>
        `;
    }
}
