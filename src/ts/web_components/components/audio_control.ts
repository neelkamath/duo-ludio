// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore: Missing module declaration
import {IronIcon} from '@vaadin/vaadin-icons/vaadin-icons';

/**
 * This web component's HTML name is `audio-control`. It is a play/pause button. Use [[displaysPause]] to change the
 * button's state.
 *
 * Example:
 * ```
 * <audio-control id="control"></audio-control>
 * <script>
 *     const control = document.querySelector('#control');
 *     control.addEventListener('click', () => control.displaysPause = !control.displaysPause);
 * </script>
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
        this.ironIcon.slot = 'prefix';
        this.displaysPause = false;
    }

    private _displaysPause!: boolean;

    /** Whether the control shows a pause button instead of a play button */
    get displaysPause(): boolean {
        return this._displaysPause;
    }

    set displaysPause(value: boolean) {
        value ? this.play() : this.pause();
        this._displaysPause = value;
    }

    connectedCallback() {
        if (this.connectedOnce) return;
        this.connectedOnce = true;
        this.button.append(this.ironIcon, this.text);
        this.shadowRoot!.append(this.button);
    }

    /** Makes this element a play button */
    private pause(): void {
        this.ironIcon.icon = 'vaadin:play';
        this.text.textContent = 'Play';
    }

    /** Makes this element a pause button */
    private play(): void {
        this.ironIcon.icon = 'vaadin:pause';
        this.text.textContent = 'Pause';
    }
}

customElements.define('audio-control', AudioControlElement);