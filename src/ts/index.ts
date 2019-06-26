import * as categoriesTab from './tabs/categories';
import * as editTab from './tabs/edit';
import * as storage from './storage';
import * as tracksTab from './tabs/tracks';
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

function putChild(child: HTMLElement, span: HTMLSpanElement): void {
    span.firstChild === null ? span.appendChild(child) : span.replaceChild(child, span.firstChild);
}

function getCategoriesTab(span: HTMLSpanElement): HTMLElement {
    const tab = document.createElement('vaadin-tab');
    tab.innerHTML = '<iron-icon icon="vaadin:file-tree"></iron-icon> Categories';
    tab.addEventListener('click', () => putChild(categoriesTab.getContent(), span));
    return tab;
}

function getTracksTab(span: HTMLSpanElement): HTMLElement {
    const tab = document.createElement('vaadin-tab');
    tab.innerHTML = '<iron-icon icon="vaadin:music"></iron-icon> Tracks';
    tab.addEventListener('click', () => putChild(tracksTab.getContent(), span));
    return tab;
}

function getEditTab(span: HTMLSpanElement): HTMLElement {
    const tab = document.createElement('vaadin-tab');
    tab.innerHTML = '<iron-icon icon="vaadin:edit"></iron-icon> Edit';
    tab.addEventListener('click', () => putChild(editTab.getContent(), span));
    return tab;
}

addEventListener('load', () => {
    const content = document.createElement('span');
    const tabs = document.createElement('vaadin-tabs');
    const tab = getCategoriesTab(content);
    tab.click();
    tabs.appendChild(tab);
    tabs.appendChild(getTracksTab(content));
    tabs.appendChild(getEditTab(content));
    document.body.appendChild(tabs);
    document.body.appendChild(content);
});
