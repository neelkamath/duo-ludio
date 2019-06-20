import * as storage from "../storage";

export function setUpTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        document.querySelector('#tab-content').innerHTML = getContent();
        setUpAdder();
        Object.keys(storage.getCategories()).forEach((category) => addCategory(category));
    });
}

function getContent() {
    return `
        <ok-dialog aria-label="Invalid category name" id="error-dialog"></ok-dialog>
        <add-item id="new-category"></add-item>
        <div id="categories-editor"></div>
    `;
}

function dialogDisplayed(name) {
    let dialog = document.querySelector('#error-dialog');
    if (name.length === 0) {
        dialog.render('Please enter a category name.');
        return true;
    }
    if (name in storage.getCategories()) {
        dialog.render('That category already exists.');
        return true;
    }
    return false;
}

function setUpAdder() {
    let adder = document.querySelector('#new-category');
    adder.button.addEventListener('click', () => {
        let name = adder.field.value.trim();
        adder.field.value = '';
        if (dialogDisplayed(name)) return;
        storage.createCategory(name);
        addCategory(name);
    });
}

function createCategory(category) {
    let span = document.createElement('span');
    span.innerHTML = `
        <item-editor 
            id="edit-${category}" 
            aria-label="Edit category ${category}"
            dialog-title="Delete?" 
            dialog-body="This will delete the category ${category}." 
            dialog-confirm="Delete"
        >
            ${category}
        </item-editor>
    `;
    return span;
}

function addCategory(category) {
    document.querySelector('#categories-editor').appendChild(createCategory(category));
    let editor = document.querySelector(`#edit-${category}`);
    editor.delete.addEventListener('click', () => {
        editor.confirm.addEventListener('click', () => {
            storage.deleteCategory(category);
            document.querySelector(`#edit-${category}`).remove();
        });
    });
}
