// @ts-ignore
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab';
import getCategoriesTab from './tabs/categories';
import getEditTab from './tabs/edit';
import getTracksTab from './tabs/tracks';
import * as categories from './storage/categories';
import './web_components/reusable/add_item';
import './web_components/reusable/item_editor';
import './web_components/reusable/playable_track';
import './web_components/reusable/confirm_dialog';
import './web_components/reusable/dialog_button';
import './web_components/reusable/dismiss_dialog';
import './web_components/reusable/tab_icon';
import './web_components/reusable/titled_item';
import './web_components/reusable/track_data';
import './web_components/reusable/validated_adder';
import './web_components/reusable/wave_details';
import './web_components/custom/category_adder';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-accordion/theme/material/vaadin-accordion';
import '@vaadin/vaadin-accordion/theme/material/vaadin-accordion-panel';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-details/theme/material/vaadin-details';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-item/theme/material/vaadin-item';
import '@vaadin/vaadin-tabs/theme/material/vaadin-tabs';
import '@vaadin/vaadin-tabs/theme/material/vaadin-tab';
import '@vaadin/vaadin-ordered-layout/theme/material/vaadin-vertical-layout';
import 'regenerator-runtime/runtime';

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
function getTab(
    span: HTMLSpanElement,
    name: 'Categories' | 'Tracks' | 'Edit',
    getter: () => HTMLElement | Promise<HTMLElement>
): TabElement {
    const tab = document.createElement('vaadin-tab');
    const icons = {'Categories': 'file-tree', 'Tracks': 'music', 'Edit': 'edit'};
    tab.innerHTML = `<iron-icon icon="vaadin:${icons[name]}"></iron-icon> ${name}`;
    tab.addEventListener('click', async () => putChild(await getter(), span));
    return tab;
}

addEventListener('load', async () => {
    await categories.initialize();
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
