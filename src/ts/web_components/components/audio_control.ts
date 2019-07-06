// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore: Missing module declaration
import {IronIcon} from '@vaadin/vaadin-icons/vaadin-icons';

/**
 * This web component's HTML name is `audio-control`. It is a start/stop button. Use [[displaysStop]] to change the
 * button's state.
 *
 * Example:
 * ```
 * <audio-control id="control"></audio-control>
 * <script>document.querySelector('#control').displaysStop = false;</script>
 * ```
 */
export default class AudioControlElement extends HTMLElement {
    private connectedOnce = false;
    private readonly button: ButtonElement = document.createElement('vaadin-button');
    private readonly ironIcon: IronIcon = document.createElement('iron-icon');
    private readonly text: Text = document.createTextNode('Play');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    private _displaysStop = true;

    /** Whether the control shows a stop button instead of a play button */
    get displaysStop(): boolean {
        return this._displaysStop;
    }

    set displaysStop(value: boolean) {
        value ? this.stop() : this.play();
        this._displaysStop = value;
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        this.ironIcon.icon = 'vaadin:play';
        this.ironIcon.slot = 'prefix';
        this.button.append(this.ironIcon, this.text);
        this.shadowRoot!.append(this.button);
    }

    /** Makes this element a play button */
    private stop(): void {
        this.ironIcon.icon = 'vaadin:play';
        this.text.textContent = 'Play';
    }

    /** Makes this element a stop button */
    private play(): void {
        this.ironIcon.icon = 'vaadin:stop';
        this.text.textContent = 'Stop';
    }
}

customElements.define('audio-control', AudioControlElement);