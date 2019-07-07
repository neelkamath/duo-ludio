// @ts-ignore: Missing module declaration
import {AccordionPanelElement} from '@vaadin/vaadin-accordion/src/vaadin-accordion-panel';
import PlayableTrackElement from '../../web_components/components/playable_track';
import * as categories from '../../storage/categories';
import * as beats from '../../storage/beats';
import AudioPlayer from '../../audio_player';

/** @returns About this app */
export function getAbout(): HTMLSpanElement {
    const span = document.createElement('span');
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
    span.append(document.createElement('br'), details, document.createElement('br'));
    return span;
}

/**
 * `ParentNode.append()` these slowly yielded categories to the `vaadin-accordion` web component. Subsequent calls to
 * this function should finish executing nearly instantly, since each [[PlayableTrackElement]] in the returned
 * `AccordionPanelElement` is cached (i.e., only the new tracks will require noticeable execution time).
 * @param player The single audio player which controls playback of all tracks
 */
export async function* getCategories(player: AudioPlayer): AsyncIterableIterator<AccordionPanelElement> {
    for (const category of await categories.getNames()) {
        const panel = document.createElement('vaadin-accordion-panel');
        const h1 = document.createElement('h1');
        h1.slot = 'summary';
        h1.textContent = category;
        const span = document.createElement('span');
        if (await categories.hasTracks(category)) {
            for (const track of await categories.getCategory(category)) {
                span.append(await PlayableGetter.getTrack(category, track, player));
            }
        } else {
            span.textContent = 'No tracks';
        }
        panel.append(h1, span);
        yield panel;
    }
}

/** Singleton for getting [[PlayableTrackElement]]s */
class PlayableGetter {
    /** Keys are category names, and the keys of values are track names (e.g., `'Alpha_8_Hz.mp3'`) */
    private static memoizedElements: Map<string, Map<string, PlayableTrackElement>> = new Map();

    /**
     * @param category Category containing `track`
     * @param track The track (e.g., `'Alpha_8_Hz.mp3'`) to create into a UI element
     * @param player The single audio player which controls playback of all tracks
     */
    static async getTrack(category: string, track: string, player: AudioPlayer): Promise<PlayableTrackElement> {
        if (!PlayableGetter.memoizedElements.has(category)) PlayableGetter.memoizedElements.set(category, new Map());
        if (!PlayableGetter.memoizedElements.get(category)!.has(track)) {
            const playable = document.createElement('playable-track') as PlayableTrackElement;
            playable.player = player;
            const name = track.slice(0, track.lastIndexOf('.')).replace(/_/g, ' ');
            playable.setAttribute('name', name);
            if (beats.trackHasEffects(track)) playable.append(getEffects(track));
            placeAudio(playable, track);
            PlayableGetter.memoizedElements.get(category)!.set(track, playable);
        }
        return PlayableGetter.memoizedElements.get(category)!.get(track)!;
    }
}

/** Deals with `playable`'s audio player, including when it the network goes off/on  */
async function placeAudio(playable: PlayableTrackElement, track: string): Promise<void> {
    if (await beats.isDownloaded(track)) {
        displayControl(playable, track);
    } else {
        navigator.onLine ? playable.displayDownloader() : playable.displayOffline();
        const displayDownloader = () => playable.displayDownloader();
        addEventListener('online', displayDownloader);
        const displayOffline = () => playable.displayOffline();
        addEventListener('offline', displayOffline);
        beats.awaitDownload(track).then(() => {
            removeEventListener('online', displayDownloader);
            removeEventListener('offline', displayOffline);
            displayControl(playable, track);
        });
    }
}

/** Sets [[PlayableTrackElement.source]] to the assumed to be already downloaded `track` (e.g., `'Alpha_8_Hz.mp3'`) */
async function displayControl(playable: PlayableTrackElement, track: string): Promise<void> {
    playable.source = await beats.TrackGetter.getTrack(track);
    playable.displayControl();
}

/**
 * @param track (e.g., `'Alpha_8_Hz.mp3'`)
 * @return Track's effects, assuming they're present
 */
function getEffects(track: string): HTMLUListElement {
    return beats.getTrackEffects(track)!.reduce((effects, effect) => {
        const li = document.createElement('li');
        li.textContent = effect;
        effects.append(li);
        return effects;
    }, document.createElement('ul'));
}