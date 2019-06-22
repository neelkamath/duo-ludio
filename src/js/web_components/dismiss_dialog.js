import * as utility from '../utility';

class DismissDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        let template = document.createElement('template');
        template.innerHTML = `
            <vaadin-dialog id="dialog" ${utility.getAttribute(this, 'aria-label')}></vaadin-dialog>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(html) {
        let dialog = this.shadowRoot.querySelector('#dialog');
        dialog.renderer = (root) => root.innerHTML = html;
        dialog.opened = true;
    }
}

customElements.define('dismiss-dialog', DismissDialog);