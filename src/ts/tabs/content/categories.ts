// @ts-ignore: Missing module declaration
import {AccordionElement} from '@vaadin/vaadin-accordion/src/vaadin-accordion';
import {PlayableTrackElement} from '../../web_components/components/playable_track';
import * as categories from '../../storage/categories';
import * as beats from '../../storage/beats';
import {AudioPlayerElement} from '../../web_components/components/audio_player';

/**
 * The contents of the "Categories" tab
 * @param player The single audio player to control playback of all tracks
 */
export default async function (player: AudioPlayerElement): Promise<HTMLSpanElement> {
    const span = document.createElement('span');
    const accordion = await getCategories(player);
    span.append(accordion);
    if (accordion.hasChildNodes()) span.append(document.createElement('br'));
    span.append(getAbout());
    return span;
}

/** @returns About this app */
function getAbout(): HTMLSpanElement {
    const details = document.createElement('vaadin-details');
    details.innerHTML = `
        <div slot="summary"><h1>About</h1></div>
        <p>
            For a person who needs help concentrating, Duo Ludio is a web app that provides categorized binaural beats. 
            Unlike other binaural beats players, this product is accessible anywhere since it has the option of being 
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

/** @param player The single audio player to control playback of all tracks */
async function getCategories(player: AudioPlayerElement): AccordionElement {
    const accordion = document.createElement('vaadin-accordion');
    for (const category of await categories.getNames()) {
        const panel = document.createElement('vaadin-accordion-panel');
        const h1 = document.createElement('h1');
        h1.slot = 'summary';
        h1.textContent = category;
        const span = document.createElement('span');
        if (await categories.hasTracks(category)) {
            for (const track of await categories.getCategory(category)) span.append(await getTrack(track, player));
        } else {
            span.textContent = 'No tracks';
        }
        panel.append(h1, span);
        accordion.append(panel);
    }
    return accordion;
}

/**
 * @param track The track (e.g., `'Alpha_8_Hz.aac'`) to create into a UI element
 * @param player The single audio player to control playback of all tracks
 */
export async function getTrack(track: string, player: AudioPlayerElement): Promise<PlayableTrackElement> {
    const playable = document.createElement('playable-track') as PlayableTrackElement;
    playable.player = player;
    const parts = track.split('.');
    const name = parts[0].replace(/_/g, ' ');
    playable.setAttribute('name', name);
    playable.setAttribute('src', URL.createObjectURL(await beats.getAudio(track)));
    playable.setAttribute('format', parts[1]);
    playable.setAttribute('duration', (beats.getTrackDuration(track) * 1000).toString());
    if (beats.trackHasEffects(track)) playable.append(getEffects(track));
    await placeAudio(playable, track);
    return playable;
}

/** Deals with `playable`'s audio player, including when it the network goes off/on  */
async function placeAudio(playable: PlayableTrackElement, track: string): Promise<void> {
    if (await beats.isDownloaded(track)) {
        playable.displayControl();
    } else {
        navigator.onLine ? playable.displayDownloader() : playable.displayOffline();
        const displayDownloader = () => playable.displayDownloader();
        addEventListener('online', displayDownloader);
        const displayOffline = () => playable.displayOffline();
        addEventListener('offline', displayOffline);
        beats.awaitDownload(track).then(() => {
            removeEventListener('online', displayDownloader);
            removeEventListener('offline', displayOffline);
            playable.displayControl();
        });
    }
}

/**
 * @param track (e.g., `'Alpha_8_Hz.aac'`)
 * @return Track's effects, assuming they're present
 */
function getEffects(track: string): HTMLUListElement {
    return [...beats.getTrackEffects(track)!].reduce((effects, effect) => {
        const li = document.createElement('li');
        li.textContent = effect;
        effects.append(li);
        return effects;
    }, document.createElement('ul'));
}