// @ts-ignore: Missing module declaration
import {TabElement} from '@vaadin/vaadin-tabs/src/vaadin-tab';
// @ts-ignore: Missing module declaration
import {ButtonElement} from '@vaadin/vaadin-button/src/vaadin-button';
import getCategoriesTab from './tabs/categories';
import getEditTab from './tabs/edit';
import getTracksTab from './tabs/tracks';
import * as categories from './storage/categories';
import './web_components/components';
import localForage from 'localforage';
import AudioPlayerElement from './web_components/components/audio-player';

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
        for (const child of content.childNodes) child.remove();
        putContent(content);
    });
    return tab;
}

/**
 * Certain browsers, such as Chrome on Mac, do not have a native install button for PWAs. Hence, one must be manually
 * created and shown.
 * @returns Button to install the PWA, with its CSS `display` set to `none`
 */
function createInstaller(): ButtonElement {
    const button = document.createElement('vaadin-button');
    button.style.display = 'none';
    button.innerHTML = '<iron-icon icon="vaadin:home" slot="prefix"></iron-icon> Install';
    return button;
}

async function initUI(): Promise<void> {
    await categories.initialize();
    const tabs = document.createElement('vaadin-tabs');
    const content = document.createElement('span');
    const player = document.createElement('audio-player') as AudioPlayerElement;
    const tab = getTab('Categories', content, async (span) => {
        span.append(await getCategoriesTab(player));
    });
    tab.click();
    tabs.append(
        tab,
        getTab('Tracks', content, (span) => {
            player.stop();
            span.append(getTracksTab());
        }),
        getTab('Edit', content, async (span) => {
            player.stop();
            span.append(await getEditTab());
        })
    );
    document.body.append(tabs, installer, content);
}

const installer = createInstaller();
addEventListener('load', () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js');
    initUI();
});
let installPrompted = false; // Used since the <beforeinstallprompt> <Event> gets called twice sometimes
addEventListener('beforeinstallprompt', async (event) => {
    if (installPrompted) return;
    installPrompted = true;
    console.log('PWA is installable');
    installer.style.display = 'block';
    // @ts-ignore: <prompt> doesn't exist on <Event>
    installer.addEventListener('click', () => event.prompt());
    // @ts-ignore: <userChoice> doesn't exist on <Event>
    const result = await event.userChoice;
    console.info('User decided to', result.outcome === 'accepted' ? 'install' : 'not install');
});
addEventListener('appinstalled', () => {
    console.info('PWA installed');
    installer.remove();
});