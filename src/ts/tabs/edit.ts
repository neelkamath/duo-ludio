import getInvalidMessenger from '../message';
import * as categories from '../storage/categories';
import {ItemEditorElement, RenameEvent} from '../web_components/components/item-editor';
import {AddEvent} from '../web_components/components/category-adder';

/** @returns The contents of the "Edit" tab */
export default async function (): Promise<HTMLSpanElement> {
    const span = document.createElement('span');
    const editors = document.createElement('div');
    for (const category of await categories.getNames()) editors.append(getEditor(category));
    const adder = document.createElement('category-adder');
    adder.addEventListener('add', (event) => editors.append(getEditor((event as AddEvent).data)));
    span.append(adder, editors);
    return span;
}

/** @param category The category to create an editor for */
function getEditor(category: string): ItemEditorElement {
    const editor = document.createElement('item-editor') as ItemEditorElement;
    editor.item = category;
    editor.getInvalidMessage = getInvalidMessenger();
    let name = category;
    editor.addEventListener('rename', async (event) => {
        const {oldName, newName} = event as RenameEvent;
        await categories.rename(oldName, newName);
        name = newName;
    });
    editor.addEventListener('delete', async () => await categories.deleteCategory(name));
    return editor;
}
