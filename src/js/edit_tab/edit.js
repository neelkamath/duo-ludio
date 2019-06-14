export function setUpEditTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        fillHTML();
        setUpAdder();
        let categories = JSON.parse(localStorage.getItem('categories'));
        for (let category in categories) if (categories.hasOwnProperty(category)) addCategory(category);
    });
}

function fillHTML() {
    document.querySelector('#tab-content').innerHTML = `
        <vaadin-dialog aria-label="Invalid category name" id="error-dialog"></vaadin-dialog>
        <add-category id="new-category"></add-category>
        <div id="categories-editor"></div>
    `;
}

function renderInvalidDialog(message) {
    let dialog = document.querySelector('#error-dialog');
    dialog.renderer = (root) => root.innerHTML = `<ok-dialog id="ok-dialog" message="${message}"></ok-dialog>`;
    dialog.opened = true;
    let root = document.querySelector('#ok-dialog').shadowRoot;
    root.querySelector('#ok').addEventListener('click', () => dialog.opened = false);
}

function hasInvalidName(name) {
    if (name.length === 0) {
        renderInvalidDialog('Please enter a category name.');
        return true;
    }
    if (name in JSON.parse(localStorage.getItem('categories'))) {
        renderInvalidDialog('That category already exists');
        return true;
    }
    return false;
}

function saveCategory(category) {
    let categories = JSON.parse(localStorage.getItem('categories'));
    categories[category] = [];
    localStorage.setItem('categories', JSON.stringify(categories));
}

function setUpAdder() {
    let root = document.querySelector('#new-category').shadowRoot;
    root.querySelector('#add').addEventListener('click', () => {
        let nameField = root.querySelector('#name');
        let name = nameField.value.trim();
        if (hasInvalidName(name)) return;
        saveCategory(name);
        nameField.value = '';
        addCategory(name);
    });
}

function addCategoryHTML(category) {
    let div = document.createElement('div');
    div.innerHTML = `
        <span id="category-${category}">
            <vaadin-dialog id="delete-category-${category}-dialog" no-close-on-esc no-close-on-outside-click>
            </vaadin-dialog>
            <vaadin-item>
                <vaadin-button theme="icon" aria-label="Delete category" id="delete-category-${category}">
                    <iron-icon icon="vaadin:minus"></iron-icon>
                </vaadin-button>
                ${category}
            </vaadin-item>
        </span>
    `;
    document.querySelector('#categories-editor').appendChild(div);
}

function createDialog(category) {
    let dialog = document.querySelector(`#delete-category-${category}-dialog`);
    dialog.renderer = (root) => root.innerHTML = `
        <confirm-dialog 
            id="${category}-confirm-dialog"
            title="Delete?" 
            cancel="Cancel" 
            confirm="Delete" 
            body="This will delete the category ${category}."
        ></confirm-dialog>
    `;
    dialog.opened = true;
    return dialog;
}

function addCategory(category) {
    addCategoryHTML(category);
    document.querySelector(`#delete-category-${category}`).addEventListener('click', () => {
        let dialog = createDialog(category);
        let root = document.querySelector(`#${category}-confirm-dialog`).shadowRoot;
        root.querySelector('#cancel').addEventListener('click', () => dialog.opened = false);
        root.querySelector('#confirm').addEventListener('click', () => {
            deleteCategory(category);
            dialog.opened = false;
        });
    });
}

function deleteCategory(category) {
    let categories = JSON.parse(localStorage.getItem('categories'));
    delete categories[category];
    localStorage.setItem('categories', JSON.stringify(categories));
    document.querySelector(`#category-${category}`).remove();
}