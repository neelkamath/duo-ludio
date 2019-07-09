// @ts-ignore: Missing module declaration
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab';
import getCategoriesTab from './tabs/content/categories';
import getEditTab from './tabs/content/edit';
import getTracksTab from './tabs/content/tracks';
import * as categories from './storage/categories';
import './web_components/components';
import localForage from 'localforage';
import AudioPlayerElement from './web_components/components/audio_player';

localForage.config({name: 'Duo Ludio', description: "Stores the user's binaural beats collection"});

/**
 * @param name Tab's name
 * @param content Parent element of the tab's contents
 * @param putContent Called whenever this tab is opened with an empty element in which the new tab's contents should go
 */
function getTab(
    name: 'Categories' | 'Tracks' | 'Edit',
    content: HTMLSpanElement,
    putContent: (span: HTMLSpanElement) => void | Promise<void>
): TabElement {
    const tab = document.createElement('vaadin-tab');
    const icons = {'Categories': 'file-tree', 'Tracks': 'music', 'Edit': 'edit'};
    tab.innerHTML = `<iron-icon icon="vaadin:${icons[name]}"></iron-icon> ${name}`;
    tab.addEventListener('click', () => {
        while (content.hasChildNodes()) content.removeChild(content.firstChild!);
        putContent(content);
    });
    return tab;
}

addEventListener('load', async () => {
    await categories.initialize();
    const player = document.createElement('audio-player') as AudioPlayerElement;
    const tabs = document.createElement('vaadin-tabs');
    const content = document.createElement('span');
    const tab = getTab('Categories', content, async (span) => {
        span.append(await getCategoriesTab(player));
    });
    tab.click();
    tabs.append(
        tab,
        getTab('Tracks', content, (span) => span.append(getTracksTab())),
        getTab('Edit', content, async (span) => span.append(await getEditTab()))
    );
    const div = document.createElement('div');
    div.append(player);
    document.body.append(tabs, div, content);
});