import './confirm_dialog';

function fillHTML() {
    document.querySelector('#tab-content').innerHTML = `
        <vaadin-dialog aria-label="Error message" id="error-dialog"></vaadin-dialog>
        <vaadin-text-field label="Category name" placeholder="Mindless HW" id="new-category-name"></vaadin-text-field>
        <vaadin-button theme="icon" aria-label="Add category" id="add-category">
            <iron-icon icon="vaadin:plus"></iron-icon>
        </vaadin-button>
        <div id="categories-editor"></div>
    `;
}

export function setUpEditTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        fillHTML();
        setUpAdder();
        let categories = JSON.parse(localStorage.getItem('categories'));
        for (let category in categories) if (categories.hasOwnProperty(category)) addCategory(category);
    });
}

function renderInvalidDialog(message) {
    let dialog = document.querySelector('#error-dialog');
    dialog.renderer = (root) => root.textContent = message;
    dialog.opened = true;
}

function hasInvalidName(name) {
    if (name.length === 0) {
        renderInvalidDialog('Please enter a category name');
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
    document.querySelector('#add-category').addEventListener('click', () => {
        let nameField = document.querySelector('#new-category-name');
        let name = nameField.value.trim();
        if (hasInvalidName(name)) return;
        saveCategory(name);
        nameField.value = '';
        addCategory(name);
    });
}

function addCategoryHTML(category) {
    document.querySelector('#categories-editor').innerHTML += `
        <span id="category-${category}">
            <vaadin-dialog id="delete-category-${category}-dialog" no-close-on-esc no-close-on-outside-click>
            </vaadin-dialog>
            <vaadin-item>
                ${category}
                <vaadin-button theme="icon" aria-label="Delete category" id="delete-category-${category}">
                    <iron-icon icon="vaadin:minus"></iron-icon>
                </vaadin-button>
            </vaadin-item>
        </span>
    `;
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