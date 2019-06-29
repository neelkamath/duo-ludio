// @ts-ignore
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab.js';
import getCategoriesTab from './tabs/categories';
import getEditTab from './tabs/edit';
import getTracksTab from './tabs/tracks';
import * as categories from './storage/categories';
import './web_components/vaadin';
import './web_components/reusable/add_item';
import './web_components/reusable/item_editor';
import './web_components/reusable/confirm_dialog';
import './web_components/reusable/dialog_button';
import './web_components/reusable/dismiss_dialog';
import './web_components/reusable/tab_icon';
import './web_components/reusable/titled_item';
import './web_components/reusable/track_data';
import './web_components/reusable/validated_adder';
import './web_components/reusable/wave_details';
import './web_components/custom/category_adder';

categories.initialize();

/**
 * If `span`'s first `ChildNode` is `null`, `child` will be appended to `span`. Otherwise, it's first child will be
 * replaced with `child`.
 */
function putChild(child: HTMLElement, span: HTMLSpanElement): void {
    span.firstChild === null ? span.appendChild(child) : span.replaceChild(child, span.firstChild);
}

/**
 * @param span Where the tab's contents go
 * @param name Tab's name
 * @param getter The function to return the tab's content
 */
function getTab(span: HTMLSpanElement, name: 'Categories' | 'Tracks' | 'Edit', getter: () => HTMLElement): TabElement {
    const tab = document.createElement('vaadin-tab');
    const icons = {'Categories': 'file-tree', 'Tracks': 'music', 'Edit': 'edit'};
    tab.innerHTML = `<iron-icon icon="vaadin:${icons[name]}"></iron-icon> ${name}`;
    tab.addEventListener('click', () => putChild(getter(), span));
    return tab;
}

addEventListener('load', () => {
    const content = document.createElement('span');
    const tabs = document.createElement('vaadin-tabs');
    const tab = getTab(content, 'Categories', getCategoriesTab);
    tab.click();
    tabs.appendChild(tab);
    tabs.appendChild(getTab(content, 'Tracks', getTracksTab));
    tabs.appendChild(getTab(content, 'Edit', getEditTab));
    document.body.appendChild(tabs);
    document.body.appendChild(content);
});
