import * as categoryAdder from './category_adder';
import * as storage from '../storage';
import * as utility from '../utility';

export function setUpTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        document.querySelector('#tab-content').innerHTML = `
            <validated-adder id="new-category" aria-label="Invalid category name"></validated-adder>
            <div id="categories-editor"></div>
        `;
        let func = (name) => addCategory(name, storage.getCategoryId(name));
        categoryAdder.setUpAdder('new-category', func);
        Object.entries(storage.getCategories()).forEach(([key, value]) => addCategory(key, value['id']));
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
    editor.isInvalid = (name) => categoryAdder.getInvalidMessage(name);
    editor.setItem = (oldName, newName) => storage.renameCategory(oldName, newName);
    editor.delete.addEventListener('click', () => {
        editor.confirm.addEventListener('click', () => {
            storage.deleteCategory(category);
            editor.remove();
        });
    });
}
