import './category_adder';
import * as message from './message';
import * as storage from '../storage';

export function getContent() {
    let span = document.createElement('span');
    let editors = document.createElement('div');
    for (let category of storage.getCategoryNames()) addEditor(editors, category);
    let adder = document.createElement('category-adder');
    adder.addEventListener('add', ({detail}) => {
        addEditor(editors, detail);
    });
    span.appendChild(adder);
    span.appendChild(editors);
    return span;
}

function addEditor(editors, category) {
    let editor = createEditor(category);
    editor.getInvalidMessage = message.getInvalidMessage;
    let name = category;
    editor.addEventListener('set', ({detail}) => {
        storage.renameCategory(detail.oldName, detail.newName);
        name = detail.newName;
    });
    editor.addEventListener('delete', () => storage.deleteCategory(name));
    editors.appendChild(editor);
}

function createEditor(category) {
    let editor = document.createElement('item-editor');
    editor.setAttribute('aria-label', `Edit category ${category}`);
    editor.setAttribute('dialog-title', 'Delete?');
    editor.setAttribute('dialog-body', `This will delete the category ${category}.`);
    editor.setAttribute('dialog-confirm', 'Delete');
    editor.setAttribute('item', category);
    return editor;
}
