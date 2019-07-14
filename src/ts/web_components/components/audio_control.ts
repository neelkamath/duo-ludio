// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
// @ts-ignore: Missing module declaration
import {IronIcon} from '@vaadin/vaadin-icons/vaadin-icons';

/**
 * This web component's HTML name is `audio-control`. It is a play/stop button (play button by default). Use [[stop]] to
 * change the button's state.
 *
 * Example:
 * ```
 * <audio-control id="control" displays-stop></audio-control>
 * <script>
 *     const control = document.querySelector('#control');
 *     control.addEventListener('click', () => control.stop = !control.stop);
 * </script>
 * ```
 * @attribute stop This boolean attribute indicates whether the button is stop button or a play button
 */
export default class AudioControlElement extends HTMLElement {
    private readonly button: ButtonElement = document.createElement('vaadin-button');
    private readonly ironIcon: IronIcon = document.createElement('iron-icon');
    private readonly text = document.createTextNode('Play');

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.ironIcon.slot = 'prefix';
    }

    static get observedAttributes() {
        return ['stop'];
    }

    /** Whether the control shows a stop button instead of a play button */
    get stop(): boolean {
        return this.hasAttribute('stop');
    }

    set stop(value: boolean) {
        if (value) {
            this.setAttribute('stop', '');
        } else {
            this.removeAttribute('stop');
        }
        this.updateStop();
    }

    // @ts-ignore: Variable declared but never read
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'stop') this.updateStop();
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.updateStop();
        this.button.append(this.ironIcon, this.text);
        this.shadowRoot!.append(this.button);
    }

    disconnectedCallback() {
        for (const child of this.shadowRoot!.childNodes) this.shadowRoot!.removeChild(child);
    }

    private updateStop(): void {
        if (this.stop) {
            this.ironIcon.icon = 'vaadin:stop';
            this.text.textContent = 'Stop';
        } else {
            this.ironIcon.icon = 'vaadin:play';
            this.text.textContent = 'Play';
        }
    }
}

customElements.define('audio-control', AudioControlElement);