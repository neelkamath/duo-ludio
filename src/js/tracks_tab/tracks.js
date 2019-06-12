import * as binaurals from '../../binaural_beats/data';

export function setUpTracksTab() {
    document.querySelector('#tracks-tab').addEventListener('click', () => {
        fillHTML();
        for (let wave in binaurals) if (binaurals.hasOwnProperty(wave) && wave !== 'default') new TabSetUp(wave);
        setTimeout(() => document.querySelector('#alpha-tab').click(), 10);
    });
}

function fillHTML() {
    document.querySelector('#tab-content').innerHTML = `
        <vaadin-tabs>
            <vaadin-tab id="alpha-tab">
                <img class="tab-icon" alt="Alpha" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Greek_lc_alpha.svg/240px-Greek_lc_alpha.svg.png">
                Alpha
            </vaadin-tab>
            <vaadin-tab id="beta-tab">
                <img class="tab-icon" alt="Beta" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Greek_lc_beta.svg/240px-Greek_lc_beta.svg.png">
                Beta
            </vaadin-tab>
            <vaadin-tab id="delta-tab">
                <img class="tab-icon" alt="Delta" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Greek_lc_delta.svg/240px-Greek_lc_delta.svg.png">
                Delta
            </vaadin-tab>
            <vaadin-tab id="gamma-tab">
                <img class="tab-icon" alt="Gamma" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Greek_lc_gamma.svg/240px-Greek_lc_gamma.svg.png">
                Gamma
            </vaadin-tab>
            <vaadin-tab id="theta-tab">
                <img class="tab-icon" alt="Theta" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Greek_lc_theta.svg/240px-Greek_lc_theta.svg.png">
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
            document.querySelector('#binaurals-content').innerHTML = `
                ${this._createDetailsHTML()}
                ${this._createTrackTypesHTML()}
            `;
        });
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
                    <vaadin-item>
                        <div><strong>Effects</strong></div>
                        <div><ul>${track['effects'].map((effect) => `<li>${effect}</li>`).join('')}</ul></div>
                    </vaadin-item>
                </div>
            `;
        }
        return '';
    }

    static _createAddHTML() {
        return `
            <div class="block">
                <vaadin-button>
                    <iron-icon icon="vaadin:plus" slot="prefix"></iron-icon> 
                    Add to category
                </vaadin-button>
            </div>
        `;
    }

    static _titleCase(trackType) {
        return trackType[0].toUpperCase() + trackType.slice(1);
    }

    _createDetailsHTML() {
        return `
            <vaadin-details id="wave-details">
                <div slot="summary"><h1>Details</h1></div>
                <vaadin-item>
                    <div><strong>Frequency Range</strong></div>
                    <div>${this.data['minFrequency']} Hz - ${this.data['maxFrequency']} Hz</div>
                </vaadin-item>
                <vaadin-item>
                    <div><strong>Explanation</strong></div>
                    <div>${this.data['explanation']}</div>
                </vaadin-item>
                <vaadin-item>
                    <div><strong>Benefits</strong></div>
                    <ul>${this.data['benefits'].map((benefit) => `<li>${benefit}</li>`).join('')}</ul>
                </vaadin-item>
            </vaadin-details>
        `;
    }

    _createTrackTypesHTML() {
        return `
            <vaadin-accordion>
                ${this._createTracksHTML('pure')}
                ${this._createTracksHTML('isochronic')}
                ${this._createTracksHTML('solfeggio')}
            </vaadin-accordion>
        `;
    }

    _createTracksHTML(trackType) {
        if (!this.data.hasOwnProperty(`${trackType}Ranges`)) return '';
        let tracks = '';
        for (let track of this.data[`${trackType}Ranges`]) {
            tracks += `
                <vaadin-vertical-layout>
                    ${TabSetUp._createFrequencyHTML(track, trackType)}
                    ${TabSetUp._createTrackEffectsHTML(track)}
                    ${TabSetUp._createAddHTML()}
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
