// @ts-ignore: Missing module declaration
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab';
import AudioPlayer from './audio_player';
import * as categoriesTab from './tabs/content/categories';
import getEditTab from './tabs/content/edit';
import getTracksTab from './tabs/content/tracks';
import * as categories from './storage/categories';
import './web_components/components';

/** Function to put content in an `HTMLSpanElement` */
interface ContentPutter {
    (content: HTMLSpanElement): void | Promise<void>;
}

/** A `switch-tab` `Event` */
class SwitchTabEvent extends Event {
    /** @param tab Tab switched to */
    constructor(readonly tab: Tab) {
        super('switch-tab');
    }
}

enum Tab {Categories = 'Categories', Tracks = 'Tracks', Edit = 'Edit'}

let currentTab: Tab;

document.addEventListener('switch-tab', (event) => currentTab = (event as SwitchTabEvent).tab);

/**
 * @param name Tab's name
 * @param content Parent element of the tab's contents
 * @param putContent Called whenever this tab is opened
 */
function getTab(name: Tab, content: HTMLSpanElement, putContent: ContentPutter): TabElement {
    const tab = document.createElement('vaadin-tab');
    const icons = {'Categories': 'file-tree', 'Tracks': 'music', 'Edit': 'edit'};
    tab.innerHTML = `<iron-icon icon="vaadin:${icons[name]}"></iron-icon> ${name}`;
    tab.addEventListener('click', () => {
        while (content.hasChildNodes()) content.removeChild(content.firstChild!);
        dispatchSwitchTab(name);
        putContent(content);
    });
    return tab;
}

/**
 * Dispatches a [[SwitchTabEvent]] to `document`
 * @param name Tab switched to
 * @event
 */
function dispatchSwitchTab(name: Tab): void {
    document.dispatchEvent(new SwitchTabEvent(name));
}

function putTracksTab(span: HTMLSpanElement): void {
    span.append(getTracksTab());
}

async function putEditTab(span: HTMLSpanElement): Promise<void> {
    span.append(await getEditTab());
}

async function putCategoriesTab(span: HTMLSpanElement): Promise<void> {
    const indicator = document.createElement('progress-indicator');
    indicator.textContent = 'Loading your binaural beats...';
    const accordion = document.createElement('vaadin-accordion');
    span.append(categoriesTab.getAbout(), accordion, indicator);
    const player = new AudioPlayer();
    document.addEventListener('switch-tab', () => player.stop());
    for await (const panel of categoriesTab.getCategories(player)) {
        if (currentTab !== Tab.Categories) return;
        accordion.append(panel);
    }
    span.removeChild(indicator);
}

addEventListener('load', async () => {
    await categories.initialize();
    const tabs = document.createElement('vaadin-tabs');
    const content = document.createElement('span');
    const tab = getTab(Tab.Categories, content, putCategoriesTab);
    tab.click();
    tabs.append(tab, getTab(Tab.Tracks, content, putTracksTab), getTab(Tab.Edit, content, putEditTab));
    document.body.append(tabs, content);
});