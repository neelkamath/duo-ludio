// @ts-ignore
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore
import {IronIcon} from '@vaadin/vaadin-icons/vaadin-icons';
import TitledItemElement from './titled_item';
import AudioPlayer from '../../audio_player';

/**
 * This web component's HTML name is `playable-track`. It contains a track's name, effects, and audio player. Place the
 * effects HTML in between this element's HTML tags. Set the instance variable [[player]] ASAP.
 *
 * Example:
 * ```
 * <playable-track id="track" name="Alpha 8 Hz.mp3" src="alpha.mp3"><ul><li>Focusing</li></ul></playable-track>
 * <script>document.querySelector('#track').player = new AudioPlayer();</script>
 * ```
 *
 * @attribute name (required) Track name (e.g., `'Alpha 10 Hz Isochronic Pulses'`)
 * @attribute src (required) Audio source (e.g., `'alpha.mp3'`)
 */
export default class PlayableTrackElement extends HTMLElement {
    player!: AudioPlayer;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /** @returns A play button if `isPlaying` is `true`; a pause button otherwise */
    private static getControl(isPlaying: boolean): HTMLSpanElement {
        const span = document.createElement('span');
        const ironIcon = document.createElement('iron-icon') as IronIcon;
        ironIcon.icon = `vaadin:${isPlaying ? 'pause' : 'play'}`;
        ironIcon.slot = 'prefix';
        span.appendChild(ironIcon);
        const text = document.createElement('span');
        text.textContent = ` ${isPlaying ? 'Pause' : 'Play'}`; // Leading space separates text from icon
        span.appendChild(text);
        return span;
    }

    connectedCallback() {
        const layout = document.createElement('vaadin-vertical-layout');
        const h2 = document.createElement('h2');
        h2.textContent = this.getAttribute('name');
        layout.appendChild(h2);
        if (this.innerHTML.trim() !== '') layout.appendChild(this.getEffects());
        layout.appendChild(this.getButton());
        this.shadowRoot!.appendChild(layout);
    }

    private getEffects(): TitledItemElement {
        const item = document.createElement('titled-item') as TitledItemElement;
        item.title = 'Effects';
        item.innerHTML = this.innerHTML;
        return item;
    }

    private getButton(): ButtonElement {
        const button = document.createElement('vaadin-button');
        let isPlaying = false;
        let control = PlayableTrackElement.getControl(isPlaying);
        button.appendChild(control);
        const audio = new Audio(this.getAttribute('src')!);
        audio.loop = true;
        audio.onplay = audio.onpause = () => {
            isPlaying = !isPlaying;
            const newControl = PlayableTrackElement.getControl(isPlaying);
            button.replaceChild(newControl, control);
            control = newControl;
        };
        button.addEventListener('click', () => isPlaying ? this.player.pause() : this.player.play(audio));
        return button;
    }
}

customElements.define('playable-track', PlayableTrackElement);