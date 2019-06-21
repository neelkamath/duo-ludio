import * as storage from "../storage";
import * as utility from '../utility';

export function setUpTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        document.querySelector('#tab-content').innerHTML = getContent();
        setUpAdder();
        Object.entries(storage.getCategories()).forEach(([key, value]) => addCategory(key, value['id']));
    });
}

function getContent() {
    return `
        <ok-dialog aria-label="Invalid category name" id="error-dialog"></ok-dialog>
        <add-item id="new-category"></add-item>
        <div id="categories-editor"></div>
    `;
}

function getInvalidMessage(name) {
    if (name.length === 0) return 'Please enter a category name.';
    if (name in storage.getCategories()) return 'That category already exists.';
    return null;
}

function setUpAdder() {
    let adder = document.querySelector('#new-category');
    adder.button.addEventListener('click', () => {
        let name = adder.field.value.trim();
        adder.field.value = '';
        let dialog = document.querySelector('#error-dialog');
        let message = getInvalidMessage(name);
        if (message !== null) {
            dialog.render(message);
            return;
        }
        storage.createCategory(name);
        addCategory(name, storage.getCategoryId(name));
    });
}

function createCategory(category, id) {
    let value = utility.escapeHTML(category);
    let span = document.createElement('span');
    span.innerHTML = `
        <item-editor 
            id="${utility.escapeHTML(id)}"
            aria-label="Edit category ${value}"
            dialog-title="Delete?"
            dialog-body="This will delete the category ${value}."
            dialog-confirm="Delete"
            item="${value}"
        ></item-editor>
    `;
    return span;
}

function addCategory(category, id) {
    document.querySelector('#categories-editor').appendChild(createCategory(category, id));
    let editor = document.querySelector(`#${utility.escapeHTML(id)}`);
    editor.isInvalid = (name) => getInvalidMessage(name);
    editor.setItem = (oldName, newName) => storage.renameCategory(oldName, newName);
    editor.delete.addEventListener('click', () => {
        editor.confirm.addEventListener('click', () => {
            storage.deleteCategory(category);
            editor.remove();
        });
    });
}
