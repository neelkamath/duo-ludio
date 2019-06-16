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
        <add-item id="new-category"></add-item>
        <div id="categories-editor"></div>
    `;
}

function renderInvalidDialog(message) {
    let dialog = document.querySelector('#error-dialog');
    dialog.renderer = (root) => root.innerHTML = `<ok-dialog id="ok-dialog" message="${message}"></ok-dialog>`;
    dialog.opened = true;
    document.querySelector('#ok-dialog').button.addEventListener('click', () => dialog.opened = false);
}

function hasInvalidName(name) {
    if (name.length === 0) {
        renderInvalidDialog('Please enter a category name.');
        return true;
    }
    if (name in JSON.parse(localStorage.getItem('categories'))) {
        renderInvalidDialog('That category already exists.');
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
    let adder = document.querySelector('#new-category');
    adder.button.addEventListener('click', () => {
        let name = adder.field.value.trim();
        if (hasInvalidName(name)) return;
        saveCategory(name);
        adder.field.value = '';
        addCategory(name);
    });
}

function addCategoryHTML(category) {
    let div = document.createElement('div');
    div.innerHTML = `
        <item-editor 
            id="edit-${category}" 
            item="${category}" 
            dialog-title="Delete?" 
            dialog-body="This will delete the category ${category}." 
            dialog-confirm="Delete"
        ></item-editor>
    `;
    document.querySelector('#categories-editor').appendChild(div);
}

function addCategory(category) {
    addCategoryHTML(category);
    let editor = document.querySelector(`#edit-${category}`);
    editor.delete.addEventListener('click', () => {
        editor.confirm.addEventListener('click', () => deleteCategory(category));
    });
}

function deleteCategory(category) {
    let categories = JSON.parse(localStorage.getItem('categories'));
    delete categories[category];
    localStorage.setItem('categories', JSON.stringify(categories));
    document.querySelector(`#edit-${category}`).remove();
}