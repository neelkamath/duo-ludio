import './category_adder';
import * as message from './message';
import * as storage from '../storage';
import {ItemEditorElement} from '../web_components/item_editor';

/** @returns The contents of the "Edit" tab */
export function getContent(): HTMLSpanElement {
    const span = document.createElement('span');
    const editors = document.createElement('div');
    for (const category of storage.getCategoryNames()) editors.appendChild(getEditor(category));
    const adder = document.createElement('category-adder');
    adder.addEventListener('add', ({detail}: CustomEvent) => editors.appendChild(getEditor(detail)));
    span.appendChild(adder);
    span.appendChild(editors);
    return span;
}

/** @param category The category to create an editor for */
function getEditor(category: string): ItemEditorElement {
    const editor = document.createElement('item-editor') as ItemEditorElement;
    editor.setAttribute('aria-label', `Edit category ${category}`);
    editor.setAttribute('dialog-title', 'Delete?');
    editor.setAttribute('dialog-body', `This will delete the category ${category}.`);
    editor.setAttribute('dialog-confirm', 'Delete');
    editor.setAttribute('item', category);
    editor.getInvalidMessage = message.getInvalidMessenger();
    let name = category;
    editor.addEventListener('set', ({detail}: CustomEvent) => {
        storage.renameCategory(detail.oldName, detail.newName);
        name = detail.newName;
    });
    editor.addEventListener('delete', () => storage.deleteCategory(name));
    return editor;
}
