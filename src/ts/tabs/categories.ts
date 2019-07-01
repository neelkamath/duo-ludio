// @ts-ignore
import {DetailsElement} from '@vaadin/vaadin-details/src/vaadin-details';
// @ts-ignore
import {AccordionPanelElement} from '@vaadin/vaadin-accordion/src/vaadin-accordion-panel';
// @ts-ignore
import trackUrls from '../../binaural_beats/tracks/*.mp3';
import PlayableTrackElement from '../web_components/reusable/playable_track';
import * as categories from '../storage/categories';
import * as beats from '../storage/beats';
import AudioPlayer from '../audio_player';

/** @returns The "Categories" tab's content */
export default async function (): Promise<HTMLSpanElement> {
    const span = document.createElement('span');
    span.appendChild(document.createElement('br'));
    span.appendChild(getDetails());
    span.appendChild(document.createElement('br'));
    const player = new AudioPlayer();
    const accordion = document.createElement('vaadin-accordion');
    for (const category of await categories.getNames()) accordion.appendChild(await getCategory(category, player));
    span.appendChild(accordion);
    return span;
}

function getDetails(): DetailsElement {
    const details = document.createElement('vaadin-details');
    details.innerHTML = `
        <div slot="summary"><h1>About</h1></div>
        <p>
            For a person who needs help concentrating, Duo Ludio is a web app that provides categorized binaural beats. 
            Unlike other binaural beats players, this product is accessible anywhere since it has the option to be 
            installed offline on any device.
        </p>
        <p>
            Binaural beats simulate brainwaves so that you can boost particular states (e.g., concentration for 
            studying, relaxation for helping fall asleep). You'll need to use headphones while listening to them.
        </p>
        <p>
            It doesn't require an account since it saves your data locally. This project is open source on
            <a href="https://github.com/neelkamath/duo-ludio">GitHub</a>.
        </p>
    `;
    return details;
}

/** @returns The tracks for `category`, where `player` is the single player to control playback of every track */
async function getCategory(category: string, player: AudioPlayer): Promise<AccordionPanelElement> {
    const panel = document.createElement('vaadin-accordion-panel');
    const div = document.createElement('div');
    div.slot = 'summary';
    div.innerHTML = `<h1>${category}</h1>`;
    panel.appendChild(div);
    const span = document.createElement('span');
    if (await categories.hasTracks(category)) {
        for (const track of await categories.getCategory(category)) span.appendChild(await getTrack(track, player));
    } else {
        const text = document.createElement('span');
        span.textContent = 'No tracks';
        span.appendChild(text);
    }
    panel.appendChild(span);
    return panel;
}

/**
 * @param track The track to create into a UI element
 * @param player The single audio player which controls playback of all tracks
 */
async function getTrack(track: string, player: AudioPlayer): Promise<PlayableTrackElement> {
    const playable = document.createElement('playable-track') as PlayableTrackElement;
    playable.player = player;
    const trackName = track.replace('.mp3', '');
    playable.setAttribute('name', trackName.replace(/_/g, ' '));
    playable.setAttribute('src', trackUrls[trackName]);
    if (beats.trackHasEffects(track)) {
        const effects = beats.getTrackEffects(track)!.reduce((effects, effect) => {
            const li = document.createElement('li');
            li.textContent = effect;
            effects.appendChild(li);
            return effects;
        }, document.createElement('ul'));
        playable.appendChild(effects);
    }
    return playable;
}