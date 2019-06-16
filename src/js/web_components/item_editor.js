class ItemEditor extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        let content = document.querySelector('#item-editor-template').content;
        this.shadowRoot.appendChild(content.cloneNode(true));

        this.shadowRoot.querySelector('#item').textContent = this.getAttribute('item');
        this.shadowRoot.querySelector('#delete').addEventListener('click', () => {
            let dialog = this.shadowRoot.querySelector('#dialog');
            let cancelText = 'Cancel';
            if (this.hasAttribute('dialog-cancel')) {
                cancelText = this.getAttribute('dialog-cancel');
            }
            let confirmText = 'Confirm';
            if (this.hasAttribute('dialog-confirm')) {
                confirmText = this.getAttribute('dialog-confirm');
            }
            dialog.renderer = (root) => root.innerHTML = `
                <confirm-dialog 
                    id="confirm-dialog"
                    title="${this.getAttribute('dialog-title')}" 
                    cancel="${cancelText}" 
                    confirm="${confirmText}" 
                    body="${this.getAttribute('dialog-body')}"
                ></confirm-dialog>
            `;
            dialog.opened = true;
        });
    }
}

customElements.define('item-editor', ItemEditor);