import getInvalidMessenger from './message';
import * as categories from '../storage/categories';
import {ItemEditorElement, SetEvent} from '../web_components/reusable/item_editor';
import {AddEvent} from '../web_components/custom/category_adder';

/** @returns The contents of the "Edit" tab */
export default async function (): Promise<HTMLSpanElement> {
    const span = document.createElement('span');
    const editors = document.createElement('div');
    for (const category of await categories.getNames()) editors.appendChild(getEditor(category));
    const adder = document.createElement('category-adder');
    adder.addEventListener('add', (event) => editors.appendChild(getEditor((event as AddEvent).data)));
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
    editor.getInvalidMessage = getInvalidMessenger();
    let name = category;
    editor.addEventListener('set', async (event) => {
        const {oldName, newName} = event as SetEvent;
        await categories.rename(oldName, newName);
        name = newName;
    });
    editor.addEventListener('delete', async () => await categories.deleteCategory(name));
    return editor;
}
