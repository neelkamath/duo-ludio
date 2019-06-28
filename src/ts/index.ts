import * as categoriesTab from './tabs/categories';
import * as editTab from './tabs/edit';
import * as storage from './storage';
import * as tracksTab from './tabs/tracks';
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab';
import './web_components/add_item';
import './web_components/item_editor';
import './web_components/confirm_dialog';
import './web_components/dialog_button';
import './web_components/dismiss_dialog';
import './web_components/tab_icon';
import './web_components/titled_item';
import './web_components/track_data';
import './web_components/vaadin';
import './web_components/validated_adder';
import './web_components/wave_details';

storage.initialize();

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
    const tab = getTab(content, 'Categories', categoriesTab.getContent);
    tab.click();
    tabs.appendChild(tab);
    tabs.appendChild(getTab(content, 'Tracks', tracksTab.getContent));
    tabs.appendChild(getTab(content, 'Edit', editTab.getContent));
    document.body.appendChild(tabs);
    document.body.appendChild(content);
});
